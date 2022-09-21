var input_substring = "null"
var scribbles_substring = "null"

input_substring = prompt("Enter name of input layer (name can also be substring of layer name)", "input")

input_layer = get_name_of_input_layer()

var shouldReduceColorSpace = confirm("Reduce color space of input albedo?");
if (shouldReduceColorSpace == true)
{
    export_layer_as_jpg(input_layer, "Original.jpg")    // Export input image to be read by the Reduce_Color_Image.py code

    app.system(' python "C:\\Users\\Administrator\\Desktop\\multi_grabcut\\Reduce Color Space in Python\\reduce_color_space.py" ')
    rename_existing_layer_if_exists("Reduced_Color_Image")
    open_output("Reduced_Color_Image.png")
    export_layer_as_exr("Reduced_Color_Image", "input") // If color space was reduced, export reduced image as input.exr
}

var shouldContinue = confirm("Continue with execution of Grabcut?")
if (shouldContinue == true)
{
    scribbles_substring = prompt("Enter name of scribbles layer (name can also be substring of layer name)", "scribbles")
    scribbles_layer = get_name_of_scribble_layer()
    if (shouldReduceColorSpace == false)
    {
        export_layer_as_exr(input_layer, "input")   // If color space was not reduced, export input layer as input.exr
    }
    execute_grabcut()
}
else
{
    Error.runtimeError(9999, "Exit Script");
}

function execute_grabcut()
{
    export_layer_as_png(scribbles_layer, "scribbles.png")   // Export scribbles layer as png
    app.system('wsl')
    rename_existing_layer_if_exists("output_rgb")
    open_output("output_rgb.png")
}

function export_layer_as_png(layer_name, output_name)
{
    // Select scribbles layer
    selectLayer(layer_name)

    app.activeDocument.activeLayer.visible = true
    for (var i = 0; i < app.activeDocument.artLayers.length; i++)
    {
        app.activeDocument.activeLayer = app.activeDocument.layers[i]
        if (app.activeDocument.activeLayer.name != layer_name)
        {
            app.activeDocument.activeLayer.visible = false
        }
    }

    var idExpr = charIDToTypeID( "Expr" );
    var desc2113 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
        var desc2114 = new ActionDescriptor();
        var idOp = charIDToTypeID( "Op  " );
        var idSWOp = charIDToTypeID( "SWOp" );
        var idOpSa = charIDToTypeID( "OpSa" );
        desc2114.putEnumerated( idOp, idSWOp, idOpSa );
        var idDIDr = charIDToTypeID( "DIDr" );
        desc2114.putBoolean( idDIDr, true );
        var idIn = charIDToTypeID( "In  " );
        desc2114.putPath( idIn, new File( "C:\\Users\\Administrator\\Desktop\\multi_grabcut\\data" ) );
        var idovFN = charIDToTypeID( "ovFN" );
        desc2114.putString( idovFN, output_name );
        var idFmt = charIDToTypeID( "Fmt " );
        var idIRFm = charIDToTypeID( "IRFm" );
        var idPNGeight = charIDToTypeID( "PNG8" );
        desc2114.putEnumerated( idFmt, idIRFm, idPNGeight );
        var idIntr = charIDToTypeID( "Intr" );
        desc2114.putBoolean( idIntr, false );
        var idRedA = charIDToTypeID( "RedA" );
        var idIRRd = charIDToTypeID( "IRRd" );
        var idPrcp = charIDToTypeID( "Prcp" );
        desc2114.putEnumerated( idRedA, idIRRd, idPrcp );
        var idRChT = charIDToTypeID( "RChT" );
        desc2114.putBoolean( idRChT, false );
        var idRChV = charIDToTypeID( "RChV" );
        desc2114.putBoolean( idRChV, false );
        var idAuRd = charIDToTypeID( "AuRd" );
        desc2114.putBoolean( idAuRd, false );
        var idNCol = charIDToTypeID( "NCol" );
        desc2114.putInteger( idNCol, 256 );
        var idDChS = charIDToTypeID( "DChS" );
        desc2114.putInteger( idDChS, 0 );
        var idDCUI = charIDToTypeID( "DCUI" );
        desc2114.putInteger( idDCUI, 0 );
        var idDChT = charIDToTypeID( "DChT" );
        desc2114.putBoolean( idDChT, false );
        var idDChV = charIDToTypeID( "DChV" );
        desc2114.putBoolean( idDChV, false );
        var idWebS = charIDToTypeID( "WebS" );
        desc2114.putInteger( idWebS, 0 );
        var idTDth = charIDToTypeID( "TDth" );
        var idIRDt = charIDToTypeID( "IRDt" );
        var idNone = charIDToTypeID( "None" );
        desc2114.putEnumerated( idTDth, idIRDt, idNone );
        var idTDtA = charIDToTypeID( "TDtA" );
        desc2114.putInteger( idTDtA, 100 );
        var idTrns = charIDToTypeID( "Trns" );
        desc2114.putBoolean( idTrns, false );
        var idMtt = charIDToTypeID( "Mtt " );
        desc2114.putBoolean( idMtt, true );
        var idDthr = charIDToTypeID( "Dthr" );
        var idIRDt = charIDToTypeID( "IRDt" );
        var idNone = charIDToTypeID( "None" );
        desc2114.putEnumerated( idDthr, idIRDt, idNone );
        var idDthA = charIDToTypeID( "DthA" );
        desc2114.putInteger( idDthA, 100 );
        var idEICC = charIDToTypeID( "EICC" );
        desc2114.putBoolean( idEICC, false );
        var idMttR = charIDToTypeID( "MttR" );
        desc2114.putInteger( idMttR, 255 );
        var idMttG = charIDToTypeID( "MttG" );
        desc2114.putInteger( idMttG, 255 );
        var idMttB = charIDToTypeID( "MttB" );
        desc2114.putInteger( idMttB, 255 );
        var idSHTM = charIDToTypeID( "SHTM" );
        desc2114.putBoolean( idSHTM, false );
        var idSImg = charIDToTypeID( "SImg" );
        desc2114.putBoolean( idSImg, true );
        var idSWsl = charIDToTypeID( "SWsl" );
        var idSTsl = charIDToTypeID( "STsl" );
        var idSLAl = charIDToTypeID( "SLAl" );
        desc2114.putEnumerated( idSWsl, idSTsl, idSLAl );
        var idSWch = charIDToTypeID( "SWch" );
        var idSTch = charIDToTypeID( "STch" );
        var idCHDc = charIDToTypeID( "CHDc" );
        desc2114.putEnumerated( idSWch, idSTch, idCHDc );
        var idSWmd = charIDToTypeID( "SWmd" );
        var idSTmd = charIDToTypeID( "STmd" );
        var idMDCC = charIDToTypeID( "MDCC" );
        desc2114.putEnumerated( idSWmd, idSTmd, idMDCC );
        var idohXH = charIDToTypeID( "ohXH" );
        desc2114.putBoolean( idohXH, false );
        var idohIC = charIDToTypeID( "ohIC" );
        desc2114.putBoolean( idohIC, true );
        var idohAA = charIDToTypeID( "ohAA" );
        desc2114.putBoolean( idohAA, true );
        var idohQA = charIDToTypeID( "ohQA" );
        desc2114.putBoolean( idohQA, true );
        var idohCA = charIDToTypeID( "ohCA" );
        desc2114.putBoolean( idohCA, false );
        var idohIZ = charIDToTypeID( "ohIZ" );
        desc2114.putBoolean( idohIZ, true );
        var idohTC = charIDToTypeID( "ohTC" );
        var idSToc = charIDToTypeID( "SToc" );
        var idOCzerothree = charIDToTypeID( "OC03" );
        desc2114.putEnumerated( idohTC, idSToc, idOCzerothree );
        var idohAC = charIDToTypeID( "ohAC" );
        var idSToc = charIDToTypeID( "SToc" );
        var idOCzerothree = charIDToTypeID( "OC03" );
        desc2114.putEnumerated( idohAC, idSToc, idOCzerothree );
        var idohIn = charIDToTypeID( "ohIn" );
        desc2114.putInteger( idohIn, -1 );
        var idohLE = charIDToTypeID( "ohLE" );
        var idSTle = charIDToTypeID( "STle" );
        var idLEzerothree = charIDToTypeID( "LE03" );
        desc2114.putEnumerated( idohLE, idSTle, idLEzerothree );
        var idohEn = charIDToTypeID( "ohEn" );
        var idSTen = charIDToTypeID( "STen" );
        var idENzerozero = charIDToTypeID( "EN00" );
        desc2114.putEnumerated( idohEn, idSTen, idENzerozero );
        var idolCS = charIDToTypeID( "olCS" );
        desc2114.putBoolean( idolCS, false );
        var idolEC = charIDToTypeID( "olEC" );
        var idSTst = charIDToTypeID( "STst" );
        var idSTzerozero = charIDToTypeID( "ST00" );
        desc2114.putEnumerated( idolEC, idSTst, idSTzerozero );
        var idolWH = charIDToTypeID( "olWH" );
        var idSTwh = charIDToTypeID( "STwh" );
        var idWHzeroone = charIDToTypeID( "WH01" );
        desc2114.putEnumerated( idolWH, idSTwh, idWHzeroone );
        var idolSV = charIDToTypeID( "olSV" );
        var idSTsp = charIDToTypeID( "STsp" );
        var idSPzerofour = charIDToTypeID( "SP04" );
        desc2114.putEnumerated( idolSV, idSTsp, idSPzerofour );
        var idolSH = charIDToTypeID( "olSH" );
        var idSTsp = charIDToTypeID( "STsp" );
        var idSPzerofour = charIDToTypeID( "SP04" );
        desc2114.putEnumerated( idolSH, idSTsp, idSPzerofour );
        var idolNC = charIDToTypeID( "olNC" );
            var list272 = new ActionList();
                var desc2115 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCzerozero = charIDToTypeID( "NC00" );
                desc2115.putEnumerated( idncTp, idSTnc, idNCzerozero );
            var idSCnc = charIDToTypeID( "SCnc" );
            list272.putObject( idSCnc, desc2115 );
                var desc2116 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNConenine = charIDToTypeID( "NC19" );
                desc2116.putEnumerated( idncTp, idSTnc, idNConenine );
            var idSCnc = charIDToTypeID( "SCnc" );
            list272.putObject( idSCnc, desc2116 );
                var desc2117 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwoeight = charIDToTypeID( "NC28" );
                desc2117.putEnumerated( idncTp, idSTnc, idNCtwoeight );
            var idSCnc = charIDToTypeID( "SCnc" );
            list272.putObject( idSCnc, desc2117 );
                var desc2118 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc2118.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list272.putObject( idSCnc, desc2118 );
                var desc2119 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc2119.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list272.putObject( idSCnc, desc2119 );
                var desc2120 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc2120.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list272.putObject( idSCnc, desc2120 );
        desc2114.putList( idolNC, list272 );
        var idobIA = charIDToTypeID( "obIA" );
        desc2114.putBoolean( idobIA, false );
        var idobIP = charIDToTypeID( "obIP" );
        desc2114.putString( idobIP, """""" );
        var idobCS = charIDToTypeID( "obCS" );
        var idSTcs = charIDToTypeID( "STcs" );
        var idCSzeroone = charIDToTypeID( "CS01" );
        desc2114.putEnumerated( idobCS, idSTcs, idCSzeroone );
        var idovNC = charIDToTypeID( "ovNC" );
            var list273 = new ActionList();
                var desc2121 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCzeroone = charIDToTypeID( "NC01" );
                desc2121.putEnumerated( idncTp, idSTnc, idNCzeroone );
            var idSCnc = charIDToTypeID( "SCnc" );
            list273.putObject( idSCnc, desc2121 );
                var desc2122 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwozero = charIDToTypeID( "NC20" );
                desc2122.putEnumerated( idncTp, idSTnc, idNCtwozero );
            var idSCnc = charIDToTypeID( "SCnc" );
            list273.putObject( idSCnc, desc2122 );
                var desc2123 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCzerotwo = charIDToTypeID( "NC02" );
                desc2123.putEnumerated( idncTp, idSTnc, idNCzerotwo );
            var idSCnc = charIDToTypeID( "SCnc" );
            list273.putObject( idSCnc, desc2123 );
                var desc2124 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNConenine = charIDToTypeID( "NC19" );
                desc2124.putEnumerated( idncTp, idSTnc, idNConenine );
            var idSCnc = charIDToTypeID( "SCnc" );
            list273.putObject( idSCnc, desc2124 );
                var desc2125 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCzerosix = charIDToTypeID( "NC06" );
                desc2125.putEnumerated( idncTp, idSTnc, idNCzerosix );
            var idSCnc = charIDToTypeID( "SCnc" );
            list273.putObject( idSCnc, desc2125 );
                var desc2126 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc2126.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list273.putObject( idSCnc, desc2126 );
                var desc2127 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc2127.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list273.putObject( idSCnc, desc2127 );
                var desc2128 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc2128.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list273.putObject( idSCnc, desc2128 );
                var desc2129 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwotwo = charIDToTypeID( "NC22" );
                desc2129.putEnumerated( idncTp, idSTnc, idNCtwotwo );
            var idSCnc = charIDToTypeID( "SCnc" );
            list273.putObject( idSCnc, desc2129 );
        desc2114.putList( idovNC, list273 );
        var idovCM = charIDToTypeID( "ovCM" );
        desc2114.putBoolean( idovCM, false );
        var idovCW = charIDToTypeID( "ovCW" );
        desc2114.putBoolean( idovCW, true );
        var idovCU = charIDToTypeID( "ovCU" );
        desc2114.putBoolean( idovCU, true );
        var idovSF = charIDToTypeID( "ovSF" );
        desc2114.putBoolean( idovSF, true );
        var idovCB = charIDToTypeID( "ovCB" );
        desc2114.putBoolean( idovCB, true );
        var idovSN = charIDToTypeID( "ovSN" );
        desc2114.putString( idovSN, """images""" );
    var idSaveForWeb = stringIDToTypeID( "SaveForWeb" );
    desc2113.putObject( idUsng, idSaveForWeb, desc2114 );
    executeAction( idExpr, desc2113, DialogModes.NO );
}

function open_output(name1)
{
    var idPlc = charIDToTypeID( "Plc " );
    var desc789 = new ActionDescriptor();
    var idIdnt = charIDToTypeID( "Idnt" );
    desc789.putInteger( idIdnt, 6 );
    var idnull = charIDToTypeID( "null" );
    desc789.putPath( idnull, new File( "C:\\Users\\Administrator\\Desktop\\multi_grabcut\\data\\" + name1 ) );

    var idFTcs = charIDToTypeID( "FTcs" );
    var idQCSt = charIDToTypeID( "QCSt" );
    var idQcsa = charIDToTypeID( "Qcsa" );
    desc789.putEnumerated( idFTcs, idQCSt, idQcsa );
    var idOfst = charIDToTypeID( "Ofst" );
    var desc790 = new ActionDescriptor();
    var idHrzn = charIDToTypeID( "Hrzn" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc790.putUnitDouble( idHrzn, idPxl, 0.000000 );
    var idVrtc = charIDToTypeID( "Vrtc" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc790.putUnitDouble( idVrtc, idPxl, 0.000000 );
    var idOfst = charIDToTypeID( "Ofst" );
    desc789.putObject( idOfst, idOfst, desc790 );
    executeAction( idPlc, desc789, DialogModes.NO );
}

function selectLayer(name1)
{
        var idslct = charIDToTypeID( "slct" );
    var desc997 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref100 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref100.putName( idLyr, name1 );
    desc997.putReference( idnull, ref100 );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc997.putBoolean( idMkVs, false );
    var idLyrI = charIDToTypeID( "LyrI" );
        var list79 = new ActionList();
        list79.putInteger( 3 );
    desc997.putList( idLyrI, list79 );
    executeAction( idslct, desc997, DialogModes.NO );
}

function export_layer_as_jpg(input_layer, output_layer)
{
    selectLayer(input_layer)
    var idExpr = charIDToTypeID( "Expr" );
    var desc505 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
        var desc506 = new ActionDescriptor();
        var idOp = charIDToTypeID( "Op  " );
        var idSWOp = charIDToTypeID( "SWOp" );
        var idOpSa = charIDToTypeID( "OpSa" );
        desc506.putEnumerated( idOp, idSWOp, idOpSa );
        var idDIDr = charIDToTypeID( "DIDr" );
        desc506.putBoolean( idDIDr, true );
        var idIn = charIDToTypeID( "In  " );
        desc506.putPath( idIn, new File( "C:\\Users\\Administrator\\Desktop\\multi_grabcut\\data" ) );
        var idovFN = charIDToTypeID( "ovFN" );
        desc506.putString( idovFN, output_layer );
        var idFmt = charIDToTypeID( "Fmt " );
        var idIRFm = charIDToTypeID( "IRFm" );
        var idJPEG = charIDToTypeID( "JPEG" );
        desc506.putEnumerated( idFmt, idIRFm, idJPEG );
        var idIntr = charIDToTypeID( "Intr" );
        desc506.putBoolean( idIntr, false );
        var idQlty = charIDToTypeID( "Qlty" );
        desc506.putInteger( idQlty, 60 );
        var idQChS = charIDToTypeID( "QChS" );
        desc506.putInteger( idQChS, 0 );
        var idQCUI = charIDToTypeID( "QCUI" );
        desc506.putInteger( idQCUI, 0 );
        var idQChT = charIDToTypeID( "QChT" );
        desc506.putBoolean( idQChT, false );
        var idQChV = charIDToTypeID( "QChV" );
        desc506.putBoolean( idQChV, false );
        var idOptm = charIDToTypeID( "Optm" );
        desc506.putBoolean( idOptm, false );
        var idPass = charIDToTypeID( "Pass" );
        desc506.putInteger( idPass, 1 );
        var idblur = charIDToTypeID( "blur" );
        desc506.putDouble( idblur, 0.000000 );
        var idMtt = charIDToTypeID( "Mtt " );
        desc506.putBoolean( idMtt, true );
        var idEICC = charIDToTypeID( "EICC" );
        desc506.putBoolean( idEICC, false );
        var idMttR = charIDToTypeID( "MttR" );
        desc506.putInteger( idMttR, 255 );
        var idMttG = charIDToTypeID( "MttG" );
        desc506.putInteger( idMttG, 255 );
        var idMttB = charIDToTypeID( "MttB" );
        desc506.putInteger( idMttB, 255 );
        var idSHTM = charIDToTypeID( "SHTM" );
        desc506.putBoolean( idSHTM, false );
        var idSImg = charIDToTypeID( "SImg" );
        desc506.putBoolean( idSImg, true );
        var idSWsl = charIDToTypeID( "SWsl" );
        var idSTsl = charIDToTypeID( "STsl" );
        var idSLAl = charIDToTypeID( "SLAl" );
        desc506.putEnumerated( idSWsl, idSTsl, idSLAl );
        var idSWch = charIDToTypeID( "SWch" );
        var idSTch = charIDToTypeID( "STch" );
        var idCHsR = charIDToTypeID( "CHsR" );
        desc506.putEnumerated( idSWch, idSTch, idCHsR );
        var idSWmd = charIDToTypeID( "SWmd" );
        var idSTmd = charIDToTypeID( "STmd" );
        var idMDCC = charIDToTypeID( "MDCC" );
        desc506.putEnumerated( idSWmd, idSTmd, idMDCC );
        var idohXH = charIDToTypeID( "ohXH" );
        desc506.putBoolean( idohXH, false );
        var idohIC = charIDToTypeID( "ohIC" );
        desc506.putBoolean( idohIC, true );
        var idohAA = charIDToTypeID( "ohAA" );
        desc506.putBoolean( idohAA, true );
        var idohQA = charIDToTypeID( "ohQA" );
        desc506.putBoolean( idohQA, true );
        var idohCA = charIDToTypeID( "ohCA" );
        desc506.putBoolean( idohCA, false );
        var idohIZ = charIDToTypeID( "ohIZ" );
        desc506.putBoolean( idohIZ, true );
        var idohTC = charIDToTypeID( "ohTC" );
        var idSToc = charIDToTypeID( "SToc" );
        var idOCzerothree = charIDToTypeID( "OC03" );
        desc506.putEnumerated( idohTC, idSToc, idOCzerothree );
        var idohAC = charIDToTypeID( "ohAC" );
        var idSToc = charIDToTypeID( "SToc" );
        var idOCzerothree = charIDToTypeID( "OC03" );
        desc506.putEnumerated( idohAC, idSToc, idOCzerothree );
        var idohIn = charIDToTypeID( "ohIn" );
        desc506.putInteger( idohIn, -1 );
        var idohLE = charIDToTypeID( "ohLE" );
        var idSTle = charIDToTypeID( "STle" );
        var idLEzerothree = charIDToTypeID( "LE03" );
        desc506.putEnumerated( idohLE, idSTle, idLEzerothree );
        var idohEn = charIDToTypeID( "ohEn" );
        var idSTen = charIDToTypeID( "STen" );
        var idENzerozero = charIDToTypeID( "EN00" );
        desc506.putEnumerated( idohEn, idSTen, idENzerozero );
        var idolCS = charIDToTypeID( "olCS" );
        desc506.putBoolean( idolCS, false );
        var idolEC = charIDToTypeID( "olEC" );
        var idSTst = charIDToTypeID( "STst" );
        var idSTzerozero = charIDToTypeID( "ST00" );
        desc506.putEnumerated( idolEC, idSTst, idSTzerozero );
        var idolWH = charIDToTypeID( "olWH" );
        var idSTwh = charIDToTypeID( "STwh" );
        var idWHzeroone = charIDToTypeID( "WH01" );
        desc506.putEnumerated( idolWH, idSTwh, idWHzeroone );
        var idolSV = charIDToTypeID( "olSV" );
        var idSTsp = charIDToTypeID( "STsp" );
        var idSPzerofour = charIDToTypeID( "SP04" );
        desc506.putEnumerated( idolSV, idSTsp, idSPzerofour );
        var idolSH = charIDToTypeID( "olSH" );
        var idSTsp = charIDToTypeID( "STsp" );
        var idSPzerofour = charIDToTypeID( "SP04" );
        desc506.putEnumerated( idolSH, idSTsp, idSPzerofour );
        var idolNC = charIDToTypeID( "olNC" );
            var list92 = new ActionList();
                var desc507 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCzerozero = charIDToTypeID( "NC00" );
                desc507.putEnumerated( idncTp, idSTnc, idNCzerozero );
            var idSCnc = charIDToTypeID( "SCnc" );
            list92.putObject( idSCnc, desc507 );
                var desc508 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNConenine = charIDToTypeID( "NC19" );
                desc508.putEnumerated( idncTp, idSTnc, idNConenine );
            var idSCnc = charIDToTypeID( "SCnc" );
            list92.putObject( idSCnc, desc508 );
                var desc509 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwoeight = charIDToTypeID( "NC28" );
                desc509.putEnumerated( idncTp, idSTnc, idNCtwoeight );
            var idSCnc = charIDToTypeID( "SCnc" );
            list92.putObject( idSCnc, desc509 );
                var desc510 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc510.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list92.putObject( idSCnc, desc510 );
                var desc511 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc511.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list92.putObject( idSCnc, desc511 );
                var desc512 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc512.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list92.putObject( idSCnc, desc512 );
        desc506.putList( idolNC, list92 );
        var idobIA = charIDToTypeID( "obIA" );
        desc506.putBoolean( idobIA, false );
        var idobIP = charIDToTypeID( "obIP" );
        desc506.putString( idobIP, """""" );
        var idobCS = charIDToTypeID( "obCS" );
        var idSTcs = charIDToTypeID( "STcs" );
        var idCSzeroone = charIDToTypeID( "CS01" );
        desc506.putEnumerated( idobCS, idSTcs, idCSzeroone );
        var idovNC = charIDToTypeID( "ovNC" );
            var list93 = new ActionList();
                var desc513 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCzeroone = charIDToTypeID( "NC01" );
                desc513.putEnumerated( idncTp, idSTnc, idNCzeroone );
            var idSCnc = charIDToTypeID( "SCnc" );
            list93.putObject( idSCnc, desc513 );
                var desc514 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwozero = charIDToTypeID( "NC20" );
                desc514.putEnumerated( idncTp, idSTnc, idNCtwozero );
            var idSCnc = charIDToTypeID( "SCnc" );
            list93.putObject( idSCnc, desc514 );
                var desc515 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCzerotwo = charIDToTypeID( "NC02" );
                desc515.putEnumerated( idncTp, idSTnc, idNCzerotwo );
            var idSCnc = charIDToTypeID( "SCnc" );
            list93.putObject( idSCnc, desc515 );
                var desc516 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNConenine = charIDToTypeID( "NC19" );
                desc516.putEnumerated( idncTp, idSTnc, idNConenine );
            var idSCnc = charIDToTypeID( "SCnc" );
            list93.putObject( idSCnc, desc516 );
                var desc517 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCzerosix = charIDToTypeID( "NC06" );
                desc517.putEnumerated( idncTp, idSTnc, idNCzerosix );
            var idSCnc = charIDToTypeID( "SCnc" );
            list93.putObject( idSCnc, desc517 );
                var desc518 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc518.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list93.putObject( idSCnc, desc518 );
                var desc519 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc519.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list93.putObject( idSCnc, desc519 );
                var desc520 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwofour = charIDToTypeID( "NC24" );
                desc520.putEnumerated( idncTp, idSTnc, idNCtwofour );
            var idSCnc = charIDToTypeID( "SCnc" );
            list93.putObject( idSCnc, desc520 );
                var desc521 = new ActionDescriptor();
                var idncTp = charIDToTypeID( "ncTp" );
                var idSTnc = charIDToTypeID( "STnc" );
                var idNCtwotwo = charIDToTypeID( "NC22" );
                desc521.putEnumerated( idncTp, idSTnc, idNCtwotwo );
            var idSCnc = charIDToTypeID( "SCnc" );
            list93.putObject( idSCnc, desc521 );
        desc506.putList( idovNC, list93 );
        var idovCM = charIDToTypeID( "ovCM" );
        desc506.putBoolean( idovCM, false );
        var idovCW = charIDToTypeID( "ovCW" );
        desc506.putBoolean( idovCW, true );
        var idovCU = charIDToTypeID( "ovCU" );
        desc506.putBoolean( idovCU, true );
        var idovSF = charIDToTypeID( "ovSF" );
        desc506.putBoolean( idovSF, true );
        var idovCB = charIDToTypeID( "ovCB" );
        desc506.putBoolean( idovCB, true );
        var idovSN = charIDToTypeID( "ovSN" );
        desc506.putString( idovSN, """images""" );
    var idSaveForWeb = stringIDToTypeID( "SaveForWeb" );
    desc505.putObject( idUsng, idSaveForWeb, desc506 );
executeAction( idExpr, desc505, DialogModes.NO );
}

function get_name_of_input_layer()
{
    var list_of_layers = new Array()
    for (var i = 0; i < app.activeDocument.layers.length; i++)
    {
        list_of_layers.push(app.activeDocument.layers[i].name)
    }
    for (var i = 0; i < list_of_layers.length; i++)
    {
        var substrings = list_of_layers[i].split('_')
        for (var j = 0; j < substrings.length; j ++)
        {
            var substring = substrings[j]
            if (substring != "null")
            {
                if (substring == input_substring)
                {
                    var input_layer = list_of_layers[i]
                }
            }
        }
    }
    return input_layer
}

function get_name_of_scribble_layer()
{
    var list_of_layers = new Array()
    for (var i = 0; i < app.activeDocument.layers.length; i++)
    {
        list_of_layers.push(app.activeDocument.layers[i].name)
    }
    for (var i = 0; i < list_of_layers.length; i++)
    {
        var substrings = list_of_layers[i].split('_')
        for (var j = 0; j < substrings.length; j ++)
        {
            var substring = substrings[j]
            if (substring == scribbles_substring)
            {
                var scribbles_layer = list_of_layers[i]
            }
        }
    }
    return scribbles_layer
}

function rename_existing_layer_if_exists(name_of_layer)
{
    for (var i = 0; i < app.activeDocument.layers.length; i++)
    {
        if (app.activeDocument.layers[i].name == name_of_layer)
        {
            split_name = app.activeDocument.layers[i].name.split('_')
            if (split_name[-1] != 'Old')
            {
                app.activeDocument.layers[i].name = name_of_layer + "old"
            }
            else
            {
                if (split_name[-1] == '1')
                app.activeDocument.layers[i].name = name_of_layer + "_old" + String((parseInt(split_name[-1]) + 1))
                else
                {
                    app.activeDocument.layers[i].name = name_of_layer + "_old" + 1
                }
            }
            
        }
    }
}

function export_layer_as_exr(name_of_file)
{
    change_bit_depth_to_32()

    var idsave = charIDToTypeID( "save" );
    var desc705 = new ActionDescriptor();
    var idAs = charIDToTypeID( "As  " );
        var desc706 = new ActionDescriptor();
        var idBtDp = charIDToTypeID( "BtDp" );
        desc706.putInteger( idBtDp, 16 );
        var idCmpr = charIDToTypeID( "Cmpr" );
        desc706.putInteger( idCmpr, 4 );
        var idAChn = charIDToTypeID( "AChn" );
        desc706.putInteger( idAChn, 1 );
    var idEXRf = charIDToTypeID( "EXRf" );
    desc705.putObject( idAs, idEXRf, desc706 );
    var idIn = charIDToTypeID( "In  " );
    desc705.putPath( idIn, new File( "C:\\Users\\Administrator\\Desktop\\multi_grabcut\\data\\" + name_of_file + ".exr" ) );
    var idDocI = charIDToTypeID( "DocI" );
    desc705.putInteger( idDocI, 365 );
    var idLwCs = charIDToTypeID( "LwCs" );
    desc705.putBoolean( idLwCs, true );
    var idsaveStage = stringIDToTypeID( "saveStage" );
    var idsaveStageType = stringIDToTypeID( "saveStageType" );
    var idsaveSucceeded = stringIDToTypeID( "saveSucceeded" );
    desc705.putEnumerated( idsaveStage, idsaveStageType, idsaveSucceeded );
    executeAction( idsave, desc705, DialogModes.NO );
}

function change_bit_depth_to_32()
{
    var idCnvM = charIDToTypeID( "CnvM" );
    var desc548 = new ActionDescriptor();
    var idDpth = charIDToTypeID( "Dpth" );
    desc548.putInteger( idDpth, 32 );
    var idMrge = charIDToTypeID( "Mrge" );
    desc548.putBoolean( idMrge, false );
    var idRstr = charIDToTypeID( "Rstr" );
    desc548.putBoolean( idRstr, false );
    executeAction( idCnvM, desc548, DialogModes.NO );
}

function selectLayer(name1)
{
        var idslct = charIDToTypeID( "slct" );
    var desc997 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref100 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref100.putName( idLyr, name1 );
    desc997.putReference( idnull, ref100 );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc997.putBoolean( idMkVs, false );
    var idLyrI = charIDToTypeID( "LyrI" );
        var list79 = new ActionList();
        list79.putInteger( 3 );
    desc997.putList( idLyrI, list79 );
    executeAction( idslct, desc997, DialogModes.NO );
}