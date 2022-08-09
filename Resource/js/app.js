
var server_dir = 'https://script.google.com/macros/s/AKfycbz48-iFT3ZGmtB6n815pH5qZ81WN47hV2P8axyWkfvC_hYP4q1RRRZh1wAWY3_FDtgY/exec';

function GetDataUsers(){
    console.log('Mostrando resultados => ');

    $.post(server_dir, {TypeFunction: "GetDataUser"}, function(DataResults){
        console.log( DataResults );
    }).done(function(){
        $('.loader-container-table').fadeOut(200);
        $('#findByParameter').prop('disabled', '');
    }).fail(function() {
        $('.loader-container-table').fadeOut(200);
        $('#findByParameter').prop('disabled', '');
    });
}

function ShowSampleResults(){
    console.log('Mostrando resultados => ');

    $('.loader-container-table').show();
    $('#findByParameter').prop('disabled', 'disabled');

    $.post(server_dir, {TypeFunction: "SampleResults"}, function(DataResults){
        console.log( DataResults );

        ShowFindedResults( DataResults, true );
    }).done(function(){
        $('.loader-container-table').fadeOut(200);
        $('#findByParameter').prop('disabled', '');
    }).fail(function() {
        $('.loader-container-table').fadeOut(200);
        $('#findByParameter').prop('disabled', '');
    });
}

function ShowFindedResults( DataResults, Show ){
    var txtTable = '';

    if( DataResults[0].Status == "Correct" ){

        for(var i=0; i<DataResults[1].length; i++){
            var Results = DataResults[1][i];
            txtTable = txtTable +   "<tr>" + 
                                        "<td class='bodyFOLIO       center-align'>" + Results[3] +"</td>"+
                                        "<td class='bodySUBSISTEMA  center-align'>" + Results[1] +"</td>"+
                                        "<td class='bodyCCT         center-align'>" + Results[2] +"</td>"+
                                        "<td class='bodyCURP'>"                     + Results[4] +"</td>"+
                                        "<td class='bodyNOMBRE'>"                   + Results[5] +" "+ Results[6] +" "+ Results[7] + "</td>"+
                                    "</tr>";
        }
    }else if( DataResults.Status == "Sin resultados" ){
        txtTable = '<tr><td></td><td colspan="9"><h6>Sin resultados</h6></td></tr>'
    }

    if( Show ){
        $('.tableResultsBody').empty();
        $('.tableResultsBody').html( txtTable );
    }
};

function FindResultsByFilter(FilterObject, Show){
    console.log('Buscando por ', FilterObject.filter ,' => ');
    var chip_filter = "<div class='chip chip-search-container'> <i class='txtFilterType'> "+FilterObject.filter+": <strong class='txtFilterValue'>"+FilterObject.value+"</strong> </i></div>";

    $('.loader-container-table').show();
    $('.loader-container').show();
    $('.row-filter-data').empty();
    $('.row-filter-data').html( chip_filter );
    $('#findByParameter').val('');

    $('.btn-filter-results').addClass('disabled');
    $('#findByParameter').prop('disabled', 'disabled');
    $('#selectFilter').prop('disabled', 'disabled');

    $.post(server_dir, {TypeFunction: "FindByFilter", TypeFilter: FilterObject.filter, FilterValue: FilterObject.value}, function(DataResults){
        console.log( DataResults );
        
        ShowFindedResults( DataResults, Show );
        ShowEXUMSResults ( DataResults );
    }).done(function(DataResults) {
        var chip_counter = "<div class='chip chip-search-container2'> <i class='txtFilterType'> Número de resultados: <strong class='txtFilterValue'>"+DataResults[1].length+"</strong> </i></div>";

        $('.row-filter-data').append( chip_counter );

        $('#selectFilter').prop('disabled', '');
        $('#findByParameter').prop('disabled', '');
        $('.btn-filter-results').removeClass('disabled');

        $('.loader-container').fadeOut(200);
        $('.loader-container-table').fadeOut(200);
    }).fail(function() {
        $('#selectFilter').prop('disabled', '');
        $('#findByParameter').prop('disabled', '');
        $('.btn-filter-results').removeClass('disabled');

        $('.loader-container').fadeOut(200);
        $('.loader-container-table').fadeOut(200);
    });
}

function ShowEXUMSResults(DataResults){
    var ResultsStatus = DataResults[0];
    var ResultsData   = DataResults[1][0];

    if( ResultsStatus.Status == "Correct" ){
        $('.txtFOLIO_EXUMS').text(  ResultsData[3] );
        $('.txtSUBSISTEMA').text(   ResultsData[1] );
        $('.txtCCT').text(          ResultsData[2] );
        $('.txtCURP').text(         ResultsData[4] );
        $('.txtNOMBRE').text(       ResultsData[5] );
        $('.txtAP_PATERNO').text(   ResultsData[6] );
        $('.txtAP_MATERNO').text(   ResultsData[7] );

        $('.txtHRV').text(       ResultsData[ 8]  );
        $('.txtHRM').text(       ResultsData[ 9]  );
        $('.txtESP').text(       ResultsData[10]  );
        $('.txtMAT').text(       ResultsData[11]  );
        $('.txtCIENCIAS').text(  ResultsData[12]  );
        $('.txtSOCIALES').text(  ResultsData[13]  );
        $('.txtINGLES').text(    ResultsData[15]  );
    }else if( ResultsStatus.Status == "Sin resultados" ){
        txtData = '<h4>Sin resultados</h4>'
    }
}

$(function(){

    $('.collapsible').collapsible();
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown();
    $('.tabs').tabs();
    $('.modal').modal();
    $('.dropdown-trigger').dropdown();
    $('.slider').slider();
    $('select').formSelect();
    $('.loading-bar').hide();
    $('.loader-container').hide();
    $('.loader-container-table').hide();

    $('.txtINFO').text( '--' );
    $('.txtRESULTS').text( '--' );

    ShowSampleResults();
    GetDataUsers();
});

$('.tableResultsBody').on('click', 'tr', function(){
    var folio = $(this).children()[0].innerText;
    var findByFolio = {filter: 'Folio', value: folio};

    $(this).siblings().removeClass('tr-active');
    $(this).addClass('tr-active');

    FindResultsByFilter( findByFolio, false );
});

$('.btn-filter-results').on('click', function(){
    $('.loading-bar').show();
    $('.txtINFO').text( '--' );
    $('.txtRESULTS').text( '--' );

    var findByFolio = {
        filter: $('#selectFilter option:selected').val(),
        value:  $('#findByParameter').val()
    };

    FindResultsByFilter( findByFolio, true);

    $('.loading-bar').hide();
});

$('.btn-get-values').on('click', function(){

    $.post(server_dir, {TypeFunction: "TestingGettingData"}, function(DataResults){
        console.log( DataResults );
    }).done(function(){
        console.log('Petición exitosa');
    }).fail(function() {
        console.log('Error en AppsScript');
    });
    
});

/*

$('#selectSubsistema').on('change', function(){
    var Filters = {
        Param: $('#findByParameter').val(),
        Filter: $('#selectFilter option:selected').val(),
        Subsistema: $('#selectSubsistema option:selected').val(),
        NumResultados: $('#numResultados option:selected').val()
    }

    localStorage.setItem('Filters', JSON.stringify(Filters));
    $('#findByParameter').val('');

    getDataResults();
});

$('#numResultados').on('change', function(){
    var Filters = {
        Param: $('#findByParameter').val(),
        Filter: $('#selectFilter option:selected').val(),
        Subsistema: $('#selectSubsistema option:selected').val(),
        NumResultados: $('#numResultados option:selected').val()
    }

    localStorage.setItem('Filters', JSON.stringify(Filters));
    getDataResults();
});
*/


