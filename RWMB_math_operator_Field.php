<?php
/**
 *
 * Math operator field that sum multiple designated fields (by id)
 *
 */
class RWMB_math_operator_Field extends RWMB_Field{

    public static function html( $meta, $field )
    {
        return sprintf(
            '<input type="text" name="%s" id="%s" class="rwmb-math_operator rwmb-text" readonly value="%s">
<script type="text/html" class="rwmb_math_operator_json" data-jsoptions="%s" data-formula="%s" data-operatorfield="%s"></script>',
            $field['field_name'],
            $field['id'],
            $meta,
            esc_attr( wp_json_encode( [ "fields_id" =>  explode(',', $field['id_to_calc'] ) ] ) ),
            $field['formula'],
            $field['id']
        );
    }

    public static function add_actions()
    {
        wp_enqueue_script('math_operator_js', get_stylesheet_directory_uri().'/inc/metaboxes/fields/math_operator/js/rwmb_operation.js', ['jquery'], uniqid() );
        wp_enqueue_style('math_operator_css', get_stylesheet_directory_uri().'/inc/metaboxes/fields/math_operator/css/rwmb_operation.css', ['rwmb'], uniqid() );

    }

    public static function admin_enqueue_scripts()
    {
        wp_enqueue_script('math_operator_js', get_stylesheet_directory_uri().'/inc/metaboxes/fields/math_operator/js/rwmb_operation.js', ['jquery'], uniqid() );
    }

}

use MBB\Control;

add_filter( 'mbb_field_types', function ( $field_types ) {
    $field_types['math_operator'] = [
        'title'    => __( 'Math Operation', 'earlytrack' ),
        'category' => 'advanced',
        'controls' => [
            'name', 'id', 'type', 'label_description', 'desc',
            Control::Input( 'id_to_calc', [
                'label'   => __( 'Identifiant des champs sur lesquels le calcul doit etre fait', 'earlytrack' ),
                'tooltip' => __('Les champs doivent etre séparés par une virgule', 'earlytrack'),
                'required'    => true,
            ], [] ),
            Control::Input( 'formula', [
                'label'   => __( 'Formule de calcul', 'earlytrack' ),
                'tooltip' => __('eg: (id_1 + id_2)*3, id_1/2*id_2 etc.', 'earlytrack'),
                'required'    => true,
            ], [] ),
            'before', 'after', 'class', 'save_field', 'sanitize_callback', 'attributes', 'custom_settings','validation'
        ],
    ];

    return $field_types;
} );