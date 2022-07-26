
var server_dir = 'https://script.google.com/macros/s/AKfycbwZvyZo0qcaxvSC1S8qhrOjuU9X0lLU9wJye2W-NKDz0gGHY3ShVeRyQCH35ZSQlqBe/exec';

function ShowSampleResults(){
    console.log('Mostrando resultados => ');

    $.post(server_dir, {TypeFunction: "SampleResults"}, function(DataResults){
        console.log( DataResults );

        ShowFindedResults( DataResults, true );
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

    $.post(server_dir, {TypeFunction: "FindByFilter", TypeFilter: FilterObject.filter, FilterValue: FilterObject.value}, function(DataResults){
        console.log( DataResults );
        
        ShowFindedResults( DataResults, Show );
        ShowEXUMSResults ( DataResults );
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

    $('.txtINFO').text( '--' );
    $('.txtRESULTS').text( '--' );

    ShowSampleResults();
    console.log( $('.tableResultsBody tr').children() );
});

$('.tableResultsBody').on('click', 'tr', function(){
    var folio = $(this).children()[0].innerText;
    var findByFolio = {filter: 'Folio', value: folio};

    $(this).siblings().removeClass('tr-active');
    $(this).addClass('tr-active');

    $('.loading-bar').show();
    FindResultsByFilter( findByFolio, false );
    $('.loading-bar').hide();
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


