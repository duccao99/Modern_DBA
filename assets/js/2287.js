var t_category = $('#category-list').html();
var tS_category = Handlebars.compile(t_category);

var t_product = $('#product-list').html();
var tS_product = Handlebars.compile(t_product);

var t_subcate = $('#subcate-list').html();
var tS_subcate = Handlebars.compile(t_subcate);

$(document).ready(function(){
    let endpoint = 'http://localhost:1212/api/2287/'
    $.ajax({
        url: endpoint + 'category',
        contentType: "application/json",
        data:{'level':1},
        dataType: 'json',
        success: function(result){
            var html = tS_category({category : result});
            $( ".category" ).append(html);
            // console.log(result);
        }
    })
    $.ajax({
        url: endpoint + 'product/noibat',
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            var html = tS_product({product : result});
            $( ".product" ).append(html)
            // console.log(result);
        }
    })
    // $("body").on("click", ".categoty_list",function(e) {
    //     $.ajax({
    //         url: endpoint + 'product/category/'+ e.target.id,
    //         contentType: "application/json",
    //         dataType: 'json',
    //         success: function(result){
    //             var html = tS_product({product : result});
    //             $( ".product" ).empty();
    //             $( ".product" ).append(html);
    //             console.log(result);
    //         }
    //     })
    //   });
    $("body").on("click", ".btncategoty",function(e) {
        $.ajax({
            type: "GET",
            url: endpoint + 'category',
            contentType: 'application/json',
            data: {'level':2,'parent':e.target.id},
            contentType: 'application/json',
            success: function(result){
                console.log(result);
                var html = tS_subcate({morecate : result});
                $( ".subcate").empty();
                $( "#subcate" + e.target.id ).append(html);
            }
        })
    });
});