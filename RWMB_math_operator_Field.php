<?php
/**
 *
 * Math operator field
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
        //enqueue math.js from cloudflare
        wp_enqueue_script('math_js', '//cdnjs.cloudflare.com/ajax/libs/mathjs/6.6.4/math.min.js', ['jquery', 'rwmb'], uniqid() );
        wp_enqueue_script('math_operator_js', RWMB_math_operator_Field::get_file_url().'/js/rwmb_operation.js', ['jquery', 'rwmb', 'math_js'], uniqid() );
        wp_enqueue_style('math_operator_css', RWMB_math_operator_Field::get_file_url().'/css/rwmb_operation.css', ['rwmb'], uniqid() );

    }

    public static function admin_enqueue_scripts()
    {
        wp_enqueue_script('math_js', '//cdnjs.cloudflare.com/ajax/libs/mathjs/6.6.4/math.min.js', ['jquery', 'rwmb'], uniqid() );
        wp_enqueue_script('math_operator_js', RWMB_math_operator_Field::get_file_url().'/js/rwmb_operation.js', ['jquery', 'rwmb', 'math_js'], uniqid() );
    }

    public static function get_file_url(){
        $https = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://";
        $url_path = str_replace($_SERVER['DOCUMENT_ROOT'], '', __DIR__);
        $file_url = $https.$_SERVER['HTTP_HOST'].$url_path;
        return $file_url;
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
                'label'   => __( 'Identifier of the fields on which the calculation must be made', 'meta-box-operator' ),
                'tooltip' => __('Fields must be separated by a comma', 'meta-box-operator'),
                'required'    => true,
            ], [] ),
            Control::Input( 'formula', [
                'label'   => __( 'Formula', 'meta-box-operator' ),
                'tooltip' => __('eg: (id_1 + id_2)*3, id_1/2*id_2 etc.', 'meta-box-operator'),
                'required'    => true,
            ], [] ),
            'before', 'after', 'class', 'save_field', 'sanitize_callback', 'attributes', 'custom_settings','validation'
        ],
    ];

    return $field_types;
} );