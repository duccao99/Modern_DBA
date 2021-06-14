var t_category = $('#category-list').html();
var tS_category = Handlebars.compile(t_category);

var t_product = $('#product-list').html();
var tS_product = Handlebars.compile(t_product);

$(document).ready(function(){
    let endpoint = 'http://localhost:1212/api/2287/'
    $.ajax({
        url: endpoint + 'category',
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            var html = tS_category({category : result});
            $( ".category" ).append(html);
            console.log(result);
        }
    })
    $.ajax({
        url: endpoint + 'product/noibat',
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            var html = tS_product({product : result});
            $( ".product" ).append(html)
            console.log(result);
        }
    })
});