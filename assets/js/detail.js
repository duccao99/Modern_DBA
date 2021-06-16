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
    $("body").on("click", ".categoty_list",function(e) {
        $.ajax({
            url: endpoint + 'product/category/'+ e.target.id,
            contentType: "application/json",
            dataType: 'json',
            success: function(result){
                var html = tS_product({product : result});
                $( ".product" ).empty();
                $( ".product" ).append(html);
                console.log(result);
            }
        })
      });
});