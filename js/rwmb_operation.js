jQuery(document).ready(function($){
   $('.rwmb_math_operator_json').each(function(){
        //get the formula form data-formula
        var formula = $(this).data('formula');
        //get the operator field id from data-operatorfield attribute
        var operatorField = $(this).data('operatorfield');
        //get the operator field value
        var operatorFieldValue = $('#'+operatorField).val();

        //if the operator field is empty, set it to 0
        if(operatorFieldValue === ''){
            $('#'+operatorField).val(0);
        }

        //get the ids that we will apply the formula to, from the data-jsoptions attribute
        var ids = $(this).data('jsoptions');
        ids = ids.fields_id;

        //join with [name=] to get the radio and checkbox fields
        var idsWithNames = [];
        $.each(ids, function(index, id){
            idsWithNames.push('[name='+id+']');
        });

       //everytime the value of the ids fields changes, apply the formula
       $(document).on('change input', idsWithNames.join(','), ids, function() {
           //get the operator field value
           var operatorFieldValue = $('#'+operatorField).val();
           //if the operator field is empty, set it to 0
           if(operatorFieldValue === ''){
               $('#'+operatorField).val(0);
           }

           //get the value of the ids fields
           var values = [];
           $.each(ids, function(index, id){
               var val = $('[name='+id+']').val();
               //radio
               if($('[name='+id+']').attr('type') === 'radio'){
                   if($('[name='+id+']').is(':checked')){
                       val = +$('[name='+id+']').val();
                   }else{
                       val = 0;
                   }
               }
               //checkbox
               if($('[name='+id+']').attr('type') === 'checkbox'){
                   if($('[name='+id+']').is(':checked')){
                       val = +$('[name='+id+']').val();
                   }else{
                       val = 0;
                   }
               }
               //select
               if($('[name='+id+']').attr('type') === 'select'){
                    if($('[name='+id+']:selected').val() === ''){
                        val = 0;
                    }else{
                       val = +$('[name='+id+']:selected').val();
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
                $.each(ids, function(index, id){
                    formulaWithValues = formulaWithValues.replace(new RegExp(id, 'g'), values[index]);
                });

           //evaluate the formula
           if(eval(formulaWithValues) === Infinity){
               $('#'+operatorField).val(0);
           }else{
               $('#'+operatorField).val(eval(formulaWithValues).toFixed(2)).trigger('change');
           }
       });

   });
});