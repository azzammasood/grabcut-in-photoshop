import numpy as np
import cv2

import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

from sklearn.mixture import GaussianMixture

class ResolveOverlap:
    def __init__(
        self,
        max_iter=100,
        covariance_type="full",     # full, tied, diag, spherical
        init_params="kmeans",       # kmeans, k-means++, random, random_from_data
    ):
        self.max_iter = max_iter
        self.covariance_type = covariance_type
        self.init_params = init_params

    def _fit_gaussian(self, data):
        """
        fits a gaussuan mixture on provided data

        Args:
            data (ndarray): data of shape (n_components, n_features)
        """
        return GaussianMixture(
                    n_components=1,
                    covariance_type = self.covariance_type,
                    max_iter = self.max_iter,
                    init_params = self.init_params,
                ).fit(data)
    
    def _calculate_overlap(self, mask1, mask2):
        """
        calculates the overlapping regions between two masks

        Args:
            mask1 (ndarray): background: 0, foreground: 1 or 255
            mask2 (ndarray): background: 0, foreground: 1 or 255
        """
        # assigning background a unique label for matching
        mask1 = np.where(mask1 == 0, -1, mask1)

        return np.uint8(mask1 == mask2)

    def pixel_wise_resolution(self, image, mask1, mask2):
        """
        resolves overlapping comparing log-likelihood scores of gaussian mixtures

        Args:
            image (ndarray): 3-channel input image 
            mask1 (ndarray): background: 0, foreground: 255
            mask2 (ndarray): background: 0, foreground: 255
        """
        
        # init output 
        output_mask = np.zeros_like(mask1)

        # calculating overlap mask
        mask_overlap = self._calculate_overlap(mask1, mask2)
        
        if not np.any(mask_overlap):
            return output_mask

        # fitting gaussian on mask1 pixels
        gmm_p = self._fit_gaussian(image[(mask1 == 255) & (mask_overlap != 1)].reshape(-1, 3))

        # fitting gaussian on mask2 pixels
        gmm_q = self._fit_gaussian(image[(mask2 == 255) & (mask_overlap != 1)].reshape(-1, 3))

        # iterating over image pixels
        idx, idy = np.where(mask_overlap == 1)

        for x, y in zip(idx, idy):
            # fetching image pixel
            pixel = image[x, y]

            # calculating scores for each distribution
            score_p = gmm_p.score([pixel])
            score_q = gmm_q.score([pixel])

            # comparing class scores
            if score_p >= score_q:
                output_mask[x, y] = 1
            else:
                output_mask[x, y] = 2
        
        return output_mask

    def blob_resolution(self, image, mask1, mask2, connectivity=4, use_distance=False):
        """
        resolves overlapping using complete blobs of the overlapping regions

        Args:
            image (ndarray): 3-channel input image 
            mask1 (ndarray): background: 0, foreground: 255
            mask2 (ndarray): background: 0, foreground: 255
            connectivity (int): connectivity type to calculate the blobs in overlap region (4, 8)
            use_distance (bool): use distance metric to resolve overlap or not
        """

        # init output 
        output_mask = np.zeros_like(mask1)

        # calculating overlap mask
        mask_overlap = self._calculate_overlap(mask1, mask2)

        # fitting gaussian on mask1 pixels
        gmm_p = self._fit_gaussian(image[(mask1 == 255) & (mask_overlap != 1)].reshape(-1, 3))

        # fitting gaussian on mask2 pixels
        gmm_q = self._fit_gaussian(image[(mask2 == 255) & (mask_overlap != 1)].reshape(-1, 3))

        # finding connected components in overlapping region
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(mask_overlap*255, connectivity, cv2.CV_32S)

        # iterating over connected components
        # ignoring label==0 (background)
        for label in range(1, num_labels-1):
            if stats[label, cv2.CC_STAT_AREA] <= 1:
                continue

            connected_region = labels == label

            # using distance metric to resolve overlap
            if use_distance:
                # fitting gaussian on connected region pixels
                gmm_r = self._fit_gaussian(image[connected_region].reshape(-1, 3))

                dist_pr = self._calculate_distance(gmm_p, gmm_r)
                dist_qr = self._calculate_distance(gmm_q, gmm_r)

                if dist_pr <= dist_qr:
                    output_mask = np.where(connected_region, 1, output_mask)
                else:
                    output_mask = np.where(connected_region, 2, output_mask)
            else:
                # calculating scores for each distribution
                score_p = gmm_p.score(image[connected_region].reshape(-1, 3))
                score_q = gmm_q.score(image[connected_region].reshape(-1, 3))

                # comparing class scores
                if score_p >= score_q:
                    output_mask = np.where(connected_region, 1, output_mask)
                else:
                    output_mask = np.where(connected_region, 2, output_mask)

        return output_mask
    
    def visualize_masks(self, mask1, mask2, resolve_mask):
        """
        resolves overlapping comparing log-likelihood scores of gaussian mixtures

        Args:
            mask1 (ndarray): background: 0, foreground: 255
            mask2 (ndarray): background: 0, foreground: 255
            resolve_mask (ndarray): background: 0, class-1: 1, class-1: 2
        """

        # calculating overlap mask
        mask_overlap = self._calculate_overlap(mask1, mask2)

        # mask1
        plt.subplot(2, 2, 1)
        plt.imshow(mask1, cmap=ListedColormap(['black', 'red']))
        plt.title("Class # 1")
        plt.axis('off')

        # mask2
        plt.subplot(2, 2, 2)
        plt.imshow(mask2, cmap=ListedColormap(['black', 'blue']))
        plt.title("Class # 2")
        plt.axis('off')

        # overlap_mask
        plt.subplot(2, 2, 3)
        plt.imshow(mask_overlap, cmap=ListedColormap(['black', 'green']))
        plt.title("Overlap Region")
        plt.axis('off')

        # resolve_mask
        plt.subplot(2, 2, 4)
        plt.imshow(resolve_mask, cmap=ListedColormap(['black', 'red', 'blue']))
        plt.title("Overlap Resolution")
        plt.axis('off')

        plt.show()