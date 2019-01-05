/* Code developed by Patil, Neha
Project #2
Spring 2018
Username : jadrn029, 
RED ID : 821545485 */


var cart;
$(document).ready( function() {

cart = new shopping_cart("jadrn029");
$('#contactcontent').hide();	

$('#busyContainer').show();
$.get("/jadrn029/servlet/GetProductsInfo", showProducts);


$('#products').on('click', ".skuid",function() {
var url="";
if(this.id=="")
{
var sku = $(this).attr('src').split(".")[0].split("_")[2];
url = "/jadrn029/servlet/GetProductDetails?sku="+sku;
}
else
url = "/jadrn029/servlet/GetProductDetails?sku="+this.id;
$.get(url, showProdDetails);

});	

$('#search').on('click', function() {
$('#busyContainer').show();
	var query = "SELECT sku, vendorModel, retail, image, quantity FROM product ";
	
	if($('select[name="category"]').val() !="" && $('select[name="vendor"]').val() !="" && $('#searchtxt').val() != "")
		query += " where catID="+ $('select[name="category"]').val()+" and venID="+ $('select[name="vendor"]').val()+" and (description like '%25"+$('#searchtxt').val()+"%25' or features like '%25"+$('#searchtxt').val()+"%25');";
		
	else if($('select[name="category"]').val() !="" && $('select[name="vendor"]').val() !="")
		query += " where catID="+ $('select[name="category"]').val()+" and venID="+ $('select[name="vendor"]').val()+";";
	
	else if($('select[name="category"]').val() !="" && $('#searchtxt').val() != "")
		query += " where catID="+ $('select[name="category"]').val()+" and (description like '%25"+$('#searchtxt').val()+"%25' or features like '%25"+$('#searchtxt').val()+"%25');";
	
	else if($('select[name="vendor"]').val() !="" && $('#searchtxt').val() != "")
		query += " where venID="+ $('select[name="vendor"]').val()+" and (description like '%25"+$('#searchtxt').val()+"%25' or features like '%25"+$('#searchtxt').val()+"%25');";
	
	else if($('select[name="vendor"]').val() !="")
		query += " where venID="+ $('select[name="vendor"]').val()+";";
	
	else if ($('select[name="category"]').val() !="")
		query += " where catID="+ $('select[name="category"]').val()+";";
		
	else if($('#searchtxt').val() != "")
		query += " where (description like '%25"+$('#searchtxt').val()+"%25' or features like '%25"+$('#searchtxt').val()+"%25');";
	
	else
		query +=";";
		
	
	var url = "/jadrn029/servlet/GetSearchedProducts?query="+query;
	$.get(url, showSearchedProducts);
   
});

$('#products').on('click',".addtocart", function() {

var sku = this.id;
var qt=$("."+sku).val();

if(!$.isNumeric(qt) )
	{
	var errmsg="Quantity should be number";			
	$("#"+sku+"_err").show();
	$("#"+sku+"_err").html(errmsg);
	}
else 
	{
	$("#"+sku+"_err").hide();
	if (qt != 0)
		{
		var cartProds = cart.getCartArray();
		for(var i=0; i < cartProds.length; i++) 
		{
			if(cartProds[i][0]==sku)
			qt = parseInt(qt) + parseInt(cartProds[i][1]);
		}
		var url = "/jadrn029/servlet/CheckQuantity?sku="+this.id+"&quantity="+qt;
		$.get(url, checkQuantity);
		
        }
	}
});

$('#contactus').on('click', function(){
$('#maincontent').hide();
$('#contactcontent').show();
});

$('#cartlogo').on('click', function(){
$('#checkout').click();
});

$('#count').text(cart.size());	
});



function showProducts(response) {
$('#busyContainer').hide();

var tmpString = "";
var result = response.split("|");
var randomNo = Math.floor(Math.random() * result.length-1);
var noDup =[randomNo , (randomNo+1) % 25 , (randomNo+2)%25 , (randomNo+3)%25]; 

for(i=0; i<noDup.length; i++) 
{
	if(result[noDup[i]]=="")
	tmpString +="";	

	else
	{
	var res = result[noDup[i]].split("^");

	tmpString +='<div class="row prod"><div class="content col-md-4"><img class="border skuid" src=\"/~jadrn029/proj1/pim_&e$/'+
                res[3]+"\" alt=\""+res[3]+"\""+
                "width=\"100px\"  /></div>";
	
	tmpString +='<div class="col-md-4"><span class="skuid" id="'+res[0]+'">'+res[1]+"</span>"+
			"<br> Price : $"+res[2];
	if(res[4]==0)
		tmpString +="<br><span class='bold'>Coming soon </span></div>";
	else 
		tmpString +="<br><span class='bold'>In stock </span></div>";
		
	if(res[4]==0)
		tmpString +="<div class='col-md-4'></div></div><hr>";
	else
		tmpString +="<div class='col-md-4'>Quantity : <input type='text' name='quantity' maxlength='5' class='"+res[0]+"' size='10'><br><br><input type='button' id='"+res[0]+"' class='addtocart btn btn-primary btn-sm' value='Add To Cart' /><br><div class='error' id='"+res[0]+"_err'>&nbsp;</div></div></div><hr>";
	
	}
}
$('#products').html(tmpString);
}

// Thumbnail to large image : https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_thumbnail_image

function showProdDetails(response) {

var tmpString = "";
var res = response.split("|");
    
	tmpString +='<div class="row pdetails"><div class="content"><a target="_blank" href=\"/~jadrn029/proj1/pim_&e$/'+res[3]+'\"><img class="border" src=\"/~jadrn029/proj1/pim_&e$/'+res[3]+"\" alt=\""+res[3]+"\""+"width=\"230px\"  /></a></div>";
	
	tmpString +='<div class="justify">'+
			"<span class='bold'> Model :</span> "+res[1]+
			"<br><br><span class='bold'> Description :</span> "+res[4]+
			"<br><br><span class='bold'> Features :</span> "+res[5]+
			"<br><br><span class='bold'> Price :</span> $"+res[2];
	
	if(res[6]==0)
		tmpString +="<br><br><span class='bold'>Coming soon </span></div><br>";
	else 
		tmpString +="<br><br><span class='bold'>In stock </span></div><br>";
	
	if(res[6]==0)
		tmpString +="<div></div></div><br>";
	else
		tmpString +="<div class='qdetails'>Quantity : <input type='text' name='quantity' maxlength='5'  class='"+res[0]+"' size='10'><br><br><input type='button' id='"+res[0]+"' class='addtocart btn btn-primary btn-sm' value='Add To Cart' /><br><br><div class='error' id='"+res[0]+"_err'>&nbsp;</div></div></div><br>";
		
	$('#products').html(tmpString);
	$('#filters').hide();
	
}

function showSearchedProducts(response) {
$('#busyContainer').hide();
var tmpString = "";

if(response=="")
	tmpString +="<h3 class='noprods'>Sorry, we do not have products with these filters</h3>";

else
	{
	var result = response.split("|");
		
    for(i=0; i<result.length; i++) {
	if(result[i]=="")
	tmpString +="";
	else
	{
	var res = result[i].split("^");

	tmpString +='<div class="row prod"><div class="content col-md-4"><img class="border skuid" src=\"/~jadrn029/proj1/pim_&e$/'+
                res[3]+"\" alt=\""+res[3]+"\""+
                "width=\"100px\"  /></div>";
	
	tmpString +='<div class="col-md-4"><span class="skuid" id="'+res[0]+'">'+res[1]+"</span>"+
			"<br> Price : $"+res[2];
	if(res[4]==0)
		tmpString +="<br><span class='bold'>Coming soon </span></div>";
	else 
		tmpString +="<br><span class='bold'>In stock </span></div>";
		
	if(res[4]==0)
		tmpString +="<div class='col-md-4'></div></div><hr>";
	else
		tmpString +="<div class='col-md-4'>Quantity : <input type='text' name='quantity' maxlength='5' class='"+res[0]+"' size='10'><br><br><input type='button' id='"+res[0]+"' class='addtocart btn btn-primary btn-sm' value='Add To Cart' /><br><div class='error' id='"+res[0]+"_err'>&nbsp;</div></div></div><hr>";
	}
				
	}
	}
	$('#products').html(tmpString);
}

function checkQuantity(response) {
var result = response.split("|");
var sku = result[1];
var qt=result[2];

if(response.startsWith("OK"))
	{
		var cartProds = cart.getCartArray();
		if(cartProds.length==0)
		cart.add(sku,qt);
		
		else
		{
			for(var i=0; i < cartProds.length; i++) 
			{
				if(cartProds[i][0]==sku)
				{
				cart.setQuantity(sku, qt);
				break;
				}
				else
				{
				cart.add(sku,qt);
				break;
				}
			}
		}
	}
	else
	{
	$("#"+sku+"_err").show();
	$("#"+sku+"_err").html("Sorry, only "+ qt +" items in stock");
	}
$('#count').text(cart.size());
}

