$(document).ready(function () {
  var urunler = [];
  $.ajax({
    type: "GET",
    url: "https://dummyjson.com/products",
    dataType: "json",
    success: function (data) {
      // console.log(data);
      urunler = data.products;
      urunleriGoster(urunler);
      kategorileriGoster();
    },
  });
  function urunleriGoster(urunler) {
    $("#productList").empty();
    $.each(urunler, function (_, urun) {
      //   console.log(urun);
      const card = $("<div>").addClass("col-lg-3 col-md-4 col-sm-12 mt-5")
        .html(`
                     <div class="card" style="width: 18rem;">
                         <img src="${urun.thumbnail}" class="card-img-top" style="height: 200px;" alt="...">
                         <div class="card-body">
                             <h5 class="card-title text-truncate">${urun.title}</h5>
                             <p class="card-text">${urun.price} $</p>
                             <button class="btn btn-success btn-add-to-cart" data-id="${urun.id}">Sepete Ekle</button>
                         </div>
                     </div>          
               `);
      $("#productList").append(card);
    });
  }
  function kategorileriGoster() {
    var kategoriler = [];

    for (let urun of urunler) {
      if (!kategoriler.includes(urun.category)) {
        kategoriler.push(urun.category);
        console.log(kategoriler);
      }
    }
    for (let kategori of kategoriler) {
      const kategoriList = $("<li>").addClass("list-group-item").text(kategori);
      $("#categoryList").append(kategoriList);
      //   console.log(kategori);
    }
  }
});
