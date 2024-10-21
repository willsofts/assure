function createEditor(selector,tagary,baseurl,imgurl) {
    console.log("initEditor: selector=",selector,"tagary",tagary);
    console.log("BASE_URL",baseurl,"IMG_URL",imgurl);
    $(selector).tinymce({
        branding: false,
        height: 200,				
        plugins: [
					'advlist autolink lists link image charmap print preview hr anchor pagebreak',
					'searchreplace wordcount visualblocks visualchars code fullscreen',
					'insertdatetime media nonbreaking save table contextmenu directionality',
					'emoticons template paste textcolor colorpicker textpattern imagetools'
        ],				
        toolbar: 'undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor | insertsymbols',
        images_upload_url: baseurl+'/upload/docimage',
				images_upload_base_path: imgurl+'/uploaded/docimages',
        setup: function (editor) {
          console.log("setup: editor",editor);          
          editor.addButton('insertsymbols', { //add custom
              type: 'listbox',
              text: 'Insert Symbol',
              icon: false,
              onselect: function() {
                editor.insertContent(this.value());
              },
            values: tagary,
            onPostRender: function () {
              this.value('');
            }
          });
        }
    });
}
function getEditorContent(selector) {
  return tinymce.get(selector).getContent();
}
function setEditorContent(selector,content) {
  tinymce.get(selector).setContent(content);
}