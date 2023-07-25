( function ( $, rwmb ) {

    rwmb.$document.on('mb_ready', function(){
        $('.rwmb_math_operator_json').each(function(){
            etrck_math_operator($(this));
        });
    });

    /*
        rwmb.$document.on('clone', function(){
            console.log('clone is cloned');
            $('.rwmb_math_operator_json').each(function(){
                etrck_math_operator($(this));
            });
        });
     */

})( jQuery, rwmb );

function etrck_math_operator(object){
    //get the formula form data-formula
    var formula = object.data('formula');
    //get the operator field id from data-operatorfield attribute
    var operatorField = object.data('operatorfield');
    //get the operator field value
    var operatorFieldValue = jQuery('#'+operatorField).val();

    //if the operator field is empty, set it to 0
    if(operatorFieldValue === ''){
        jQuery('#'+operatorField).val(0);
    }

    //get the ids that we will apply the formula to, from the data-jsoptions attribute
    var ids = object.data('jsoptions');
    ids = ids.fields_id;

    //join with [name=] to get the radio and checkbox fields
    var idsWithNames = [];
    jQuery.each(ids, function(index, id){
        idsWithNames.push('[name*='+id+']');
    });

    //everytime the value of the ids fields changes, apply the formula
    jQuery(document).on('change input', idsWithNames.join(','), ids, function() {
        //get the operator field value
        var operatorFieldValue = jQuery('#'+operatorField).val();
        //if the operator field is empty, set it to 0
        if(operatorFieldValue === ''){
            jQuery('#'+operatorField).val(0);
        }

        //get the value of the ids fields
        var values = [];
        jQuery.each(ids, function(index, id){
            var val = jQuery('[name*='+id+']').val();
            //radio
            if(jQuery('[name*='+id+']').attr('type') === 'radio'){
                if(jQuery('[name*='+id+']').is(':checked')){
                    val = +jQuery('[name*='+id+']').val();
                }else{
                    val = 0;
                }
            }
            //checkbox
            if(jQuery('[name='+id+']').attr('type') === 'checkbox'){
                if(jQuery('[name='+id+']').is(':checked')){
                    val = +jQuery('[name*='+id+']').val();
                }else{
                    val = 0;
                }
            }
            //select
            if(jQuery('[name*='+id+']').attr('type') === 'select'){
                if(jQuery('[name*='+id+']:selected').val() === ''){
                    val = 0;
                }else{
                    val = +jQuery('[name*='+id+']:selected').val();
                }
            }
            //if it's empty, set it to 0
            if(val === ''){
                val = 0;
            }
            values.push(val);
        });

        //replace all occurences, even if repeated, of the ids in the formula with the values
        var formulaWithValues = formula;
        jQuery.each(ids, function(index, id){
            formulaWithValues = formulaWithValues.replace(new RegExp(id, 'g'), values[index]);
        });

        console.log(formulaWithValues);
        //evaluate the formula
        if(eval(formulaWithValues) === Infinity){
            jQuery('#'+operatorField).val(0);
        }else{
            jQuery('#'+operatorField).val(eval(formulaWithValues).toFixed(2)).trigger('change');
        }
    });
}