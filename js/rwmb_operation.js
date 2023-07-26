( function ( $, rwmb ) {


    $('.rwmb_math_operator_json').each(function(){
        etrck_math_operator($(this));
    });

    rwmb.$document.on('clone', function(events, index){
        let cloneId = 0;
        const clone = events.target;
        const cloneClass = clone.className;


        if( cloneClass === 'rwmb-math_operator rwmb-text' ){
            cloneId = clone.id;//math_operator_{random_number-letters}
            //get the parent group id
            var groupId = $('#'+cloneId).attr('name');
            groupId = groupId.split('[')[0];// get group_id from group_id[index][cloneId]
        }
        $('.rwmb-clone .rwmb_math_operator_json').each(function(){
            etrck_group_math_operator($(this), cloneId, groupId, index);
        });
    });

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
    jQuery.each(ids, function(i, id){
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
            var val = jQuery('[name*="'+id+'"]').val();
            //radio
            if(jQuery('[name*="'+id+'"]').attr('type') === 'radio'){
                if(jQuery('[name*="'+id+'"]').is(':checked')){
                    val = +jQuery('[name*="'+id+'"]').val();
                }else{
                    val = 0;
                }
            }
            //checkbox
            if(jQuery('[name*="'+id+'"]').attr('type') === 'checkbox'){
                if(jQuery('[name*="'+id+'"]').is(':checked')){
                    val = +jQuery('[name*="'+id+'"]').val();
                }else{
                    val = 0;
                }
            }
            //select
            if(jQuery('[name*="'+id+'"]').attr('type') === 'select'){
                if(jQuery('[name*="'+id+'"]').val() === ''){
                    val = 0;
                }else{
                    val = +jQuery('[name*="'+id+'"]').val();
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

        //evaluate the formula
        if(math.evaluate(formulaWithValues) === Infinity){
            jQuery('#'+operatorField).val(0);
        }else{
            jQuery('#'+operatorField).val(math.evaluate(formulaWithValues).toFixed(2)).trigger('change');
        }
    });
}

//MB GROUPS, based on the function above
function etrck_group_math_operator(object, cloneId, groupId, index){

    if(!index){
        etrck_math_operator(object);
    }

    //get the formula form data-formula
    var formula = object.data('formula');
    //get the operator field id from data-operatorfield attribute
    var operatorField = object.data('operatorfield');

    operatorField = groupId+'\\['+index+'\\]\\['+operatorField+'\\]'; //name of the newly cloned field

    //get the operator field value
    var operatorFieldValue = jQuery('[name="'+operatorField +'"]').val();

    //if the operator field is empty, set it to 0
    if(operatorFieldValue === ''){
        jQuery('[name="'+operatorField +'"]').val(0);
    }

    //get the ids that we will apply the formula to, from the data-jsoptions attribute, and convert them to the new format
    var ids = object.data('jsoptions');
    ids = ids.fields_id;

    //join with [name=] to get the radio and checkbox fields
    var idsWithNames = [];
    jQuery.each(ids, function(i, id){
        idsWithNames.push('[name*="'+groupId+'\\['+index+'\\]\\['+id+'\\]"]');
    });

    //get the id of each idsWithNames
    var idsWithNamesIds = [];
    jQuery.each(idsWithNames, function(i, id){
        idsWithNamesIds.push(jQuery(id).attr('id'));
    });

    //replace the item in the formula with the new id
    jQuery.each(ids, function(i, id){
        formula = formula.replace(id, idsWithNamesIds[i]);
    });

    //everytime the value of the ids fields changes, apply the formula
    jQuery(document).on('change input', idsWithNames.join(','), idsWithNamesIds, function() {
        console.log('group changed');
        //get the operator field value
        var operatorFieldValue = jQuery('[name="' + operatorField + '"]').val();
        //if the operator field is empty, set it to 0
        if(operatorFieldValue === ''){
            jQuery('[name="' + operatorField + '"]').val(0);
        }

        //get the value of the ids fields
        var values = [];
        jQuery.each(idsWithNames, function(index, id){
            var val = jQuery(id).val();
            //if it's empty, set it to 0
            if(val === ''){
                val = 0;
            }
            values.push(val);
        });

        //replace all occurences, even if repeated, of the ids in the formula with the values
        var formulaWithValues = formula;
        jQuery.each(idsWithNamesIds, function(index, id){
            formulaWithValues = formulaWithValues.replace(new RegExp(id, 'g'), values[index]);
        });

        //evaluate the formula
        if(math.evaluate(formulaWithValues) === Infinity){
            jQuery('[name="' + operatorField + '"]').val(0);
        }else{
            jQuery('[name="' + operatorField + '"]').val(math.evaluate(formulaWithValues).toFixed(2)).trigger('change');
        }

    });
}