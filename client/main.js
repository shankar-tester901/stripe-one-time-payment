// const getData = async() => {
//     //  console.log($('#quantity-input').val());
//     // var data = $('#quantity-input').val();
//     var data = {

//         "item1": $('#quantity-scale').attr('name'),
//         "item1qty": $('#quantity-scale').val(),
//         "item1price": $('#price-scale').val() * 100,

//         "item2": $('#quantity-shoes').attr('name'),
//         "item2qty": $('#quantity-shoes').val(),
//         "item2price": $('#price-shoes').val() * 100,

//         "item3": $('#quantity-slippers').attr('name'),
//         "item3qty": $('#quantity-slippers').val(),
//         "item3price": $('#price-slippers').val() * 100,

//         "item4": $('#quantity-belt').attr('name'),
//         "item4qty": $('#quantity-belt').val(),
//         "item4price": $('#price-belt').val() * 100


//     };
//     console.log(data);
//     const res = await fetch('/server/test_stripe_payment_function/create-checkout-session', {
//         method: 'POST',
//         body: JSON.stringify({ data: data }),

//         headers: {
//             "Content-Type": 'application/json'
//         }
//     })
//     const body = await res.json();
//     window.location.href = body.url
// }

const getData = async() => {
    //  console.log($('#quantity-input').val());
    // var data = $('#quantity-input').val();

    var data = {

        "item1": $("#quantity-scale").html(),
        "item1qty": $('#qty-scales').val(),
        "item1price": $("#price-scale").html() * 100,

        "item2": $("#quantity-shoes").html(),
        "item2qty": $('#qty-shoes').val(),
        "item2price": $("#price-shoes").html() * 100,

        "item3": $('#quantity-slippers').html(),
        "item3qty": $('#qty-slippers').val(),
        "item3price": $('#price-slippers').html() * 100,

        "item4": $('#quantity-belts').html(),
        "item4qty": $('#qty-belts').val(),
        "item4price": $('#price-belts').html() * 100


    };
    console.log(data);
    const res = await fetch('/server/test_stripe_payment_function/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ data: data }),

        headers: {
            "Content-Type": 'application/json'
        }
    })
    const body = await res.json();
    window.location.href = body.url
}

function getAllTransactions() {

    //hide the other div
    $('#listView').hide();
    $('#allTransactionsList').show();

    $.ajax({
        type: "POST",
        url: "/server/test_stripe_payment_function/getAllTransactions",
        contentType: "application/json",
        success: function(data) {
            console.log(data);
            var tableStart = '<table  class="table table-sm">';
            var tableContent = '';
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].data.object);
                tableContent = tableContent + '<tr><td>' + data[i].data.object.id + '</td><td>' + data[i].data.object.amount + '</td><td>' + data[i].data.object.payment_method_types + '</td><td>' + +'</td></tr>';
            }

            var finalContent = tableStart + tableContent + '</table>';
            //  alert(data);
            //hide breed_list
            // $('#breed_List').hide();
            $("#getAllTransactions").html(finalContent);
        },
        error: function(error) {
            alert("Error is " + error);
        }
    });


}


function getAllInvoices() {

    //hide the other div
    //$('#listView').hide();
    $('#allTransactionsList').show();
    $('#getAllInvoicesList').show();

    $.ajax({
        type: "POST",
        url: "/server/test_stripe_payment_function/getAllInvoices",
        contentType: "application/json",
        success: function(data) {
            //  console.log(data);
            var tableStart = '<table  class="table table-sm"> ' +
                '<thead><tr>' +
                '<th scope="col">Customer Email</th> <th scope = "col" > Amount </th>' +
                '<th scope="col">Customer Name</th> <th scope = "col" > Invoice </th> </tr>' +
                '</thead><tbody>';
            var tableContent = '';
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);
                tableContent = tableContent + '<tr><td>' + data[i].customer_email + '</td><td>' + data[i].amount_due + '</td><td>' + data[i].customer_name + '</td><td>' + data[i].invoice_pdf + '</td></tr>';
            }

            var finalContent = tableStart + tableContent + '</tbody></table>';

            $("#allInvoicesList").html(finalContent);
        },
        error: function(error) {
            alert("Error is " + error);
        }
    });


}

function showListView() {
    $('#listView').show();
    $('#allTransactionsList').hide();
}