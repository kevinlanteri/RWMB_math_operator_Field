# RWMB_math_operator_Field

## Description

RWMB_math_operator_Field is a custom field type that allows you to perform mathematical operations based on the values of other fields. It works with the Meta Box Builder (MBB) plugin and extends its functionality by adding a new field type called "Math Operation." This field type is useful when you need to calculate a value dynamically based on the inputs from other fields.

## Usage

To use the RWMB_math_operator_Field, follow the steps below:

1. Ensure you have the Meta Box Builder (MBB) plugin installed and activated.
2. Include RWMB_math_operator_Field.php class into your theme's `functions.php` file.

## How to Create a Math Operation Field

To create a Math Operation field using RWMB_math_operator_Field, you'll need to use the Meta Box Builder configuration and add the new field type.

1. Go to the Meta Box Builder configuration.
2. Add a new field.
3. Choose "Math Operation" from the list of field types.
4. Configure the field settings as follows:

    - **Identifiant des champs sur lesquels le calcul doit être fait**: This is a required field. Enter the IDs of the fields on which the calculation should be performed. Separate multiple field IDs with commas.

    - **Formule de calcul**: This is a required field. Enter the mathematical formula you want to use for the calculation. For example, you can use expressions like (id_1 + id_2) * 3 or id_1 / 2 * id_2.

    - Other optional settings can be configured as needed.

5. Save your Meta Box configuration.

## How it Works

When you use the "Math Operation" field in your Meta Box configuration, it will generate an input field that will display the calculated result based on the mathematical formula and the values of the specified fields.

- The field's value will be automatically updated whenever the values of the fields involved in the calculation change.

- If any of the fields used in the calculation are empty or have invalid values, the result will be set to 0.

- The calculated result is automatically rounded to two decimal places.

- If the evaluation of the formula results in Infinity, the field's value will be set to 0.