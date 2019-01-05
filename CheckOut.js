/* Code developed by Patil, Neha
Project #2
Spring 2018
Username : jadrn029, 
RED ID : 821545485 */

var cart;
var products_data;
var bill_err;
$(document).ready( function() {

$.get("/jadrn029/servlet/GetProductsInfo", showCheckOutProducts);

products_data = new Array();
cart = new shopping_cart("jadrn029");	

$("#dialog-modal").dialog({
            height: 400,
            width: 700,
            modal: true,
            autoOpen: false
});
	
$('#checkout').on('click', function() {
	$('#maincontent').show();
	$('#filters').hide();
	$('#products').hide();
	$('#customerinfo').hide();
	$('#contactcontent').hide();
	displayCartProducts("order");
});

$('#submitorder').on('click', function() {
	
	validateform();
	if(validateform())
	{
	$('#filters').hide();
	$('#products').hide();
	$("#dialog-modal").dialog('close');
	displaySummary();

	}
});

$('#cartproducts').on('keyup',"input[type='text']", function(){
var handle = this.className.substring(5);
$('#cartproducts .change_qty#'+handle).click();

});

$('#cartproducts').on('click',".delete_item", function() {
	var sku = this.id;
	cart.delete(sku);
	displayCartProducts("order");
   }); 
			
$('#cartproducts').on('click',".change_qty", function() {

var sku = this.id;
var qt=$(".ch_qt"+sku).val();	
  if(!$.isNumeric(qt))
		{	
			var errmsg="Quantity should be number";			
			$("#"+sku+"_chng_err").show();
			$("#"+sku+"_chng_err").html(errmsg);
		}
   else {
		if (qt == 0)
			{
			var errmsg="Quantity can not be zero";			
			$("#"+sku+"_chng_err").show();
			$("#"+sku+"_chng_err").html(errmsg);
			}
		else
			{
			$("#"+sku+"_chng_err").hide();
			var url = "/jadrn029/servlet/CheckQuantity?sku="+this.id+"&quantity="+qt;
			$.get(url, checkOutQuantity);
			}
		}
});

$('#cartproducts').on('click',"#placeOrder", function($e) {  

	var url = "/jadrn029/servlet/UpdateQuantity";
	$.get(url, UpdateQuantity);

});

$('#cartproducts').on('click',"#continue", function($e) {  
		
		var errArray = $('#cartproducts .error');
		var flag=0;
		
		for(var i =0;i<errArray.length;i++)
		{
			if($.trim($(errArray[i]).text()) != "") 
			{
			flag=1;
			break;
			}
		}
		if(flag==0)
		$("#dialog-modal").dialog('open');
});
		
$(document).on('click',"#cancelOrder", function($e) {  
		window.location = "http://jadran.sdsu.edu/jadrn029/proj2.html";
		});
		
$('input[type="checkbox"]').click(function() {
    if($(this).prop("checked") == true)
	validateBAdd();
	if(bill_err == false) 
	populateShipping();
	else
	document.getElementById("shipadd").checked = false;
	
});

$("#state").blur(function() {
$("#state").val($("#state").val().toUpperCase());
});

$("#Sstate").blur(function() {
$("#Sstate").val($("#Sstate").val().toUpperCase());
});

$("#contactno").blur(function() {
$("#contactno").val($("#contactno").val().replace(/(\d{3})(\d{3})(\d{4})/,'$1-$2-$3')) 									 
});

$("#Scontactno").blur(function() {
$("#Scontactno").val($("#Scontactno").val().replace(/(\d{3})(\d{3})(\d{4})/,'$1-$2-$3')) 									 
});

$('#count').text(cart.size());
			
});

function displayCartProducts(quant)
{
	  
		$('#count').text(cart.size());  
		
		var displayStr = "";
        var producttotal = 0;
        var taxRate = 0.0775;
        var shippingfee = 5;
		var name;
		var price;
        var cartProducts = cart.getCartArray();
        if(cartProducts.length == 0 && quant=="order" ){
		
         $('#cartproducts').html("<h2>Your shopping cart is empty</h2><h3>Please add some <a href='/jadrn029/proj2.html'>products</a> to cart");
		 $('#placeOrder').hide();
		 $('#cancelOrder').hide();
		 $('#continue').hide();
		 return;
        }
		
		 displayStr += '<div class="row odetails"><div class="content "><table class="order"><tr><th>Product Image</th><th>Model</th><th>Quantity</th><th>Price</th><th>Total</th>';
		
			if(quant=="order")
				displayStr += "<th>Update cart</th></tr>";
				
				else
				displayStr += "</tr>";
				
        for(var i=0; i < cartProducts.length; i++) {
         var sku = cartProducts[i][0];
         var quantity = parseInt(cartProducts[i][1]);
        
          for(var j=0; j < products_data.length; j++) {
	
           if(products_data[j][0] == cartProducts[i][0]) {   
		  
               price = parseFloat(products_data[j][2]);
               name = products_data[j][1];
               var prodPrice = quantity * price;
               producttotal += prodPrice;
			   
               displayStr += "<tr><td><img class='border' src=\"/~jadrn029/proj1/pim_&e$/"+products_data[j][3]+"\" alt=\""
			   +products_data[i][3]+"\""+" width=\"100px\"  /></td><td>"+name+"</td>";
				
				if(quant=="order"){
				displayStr += "<td><input type='text' name='quantity' maxlength='5' size='5' class='ch_qt"+products_data[j][0]+"' value='"+quantity+"' /><div class='error' id='"+products_data[j][0]+"_chng_err'>&nbsp;</div></td>";			
				}
				else
				displayStr += "<td>"+quantity+"<br></td>";
				
				displayStr +="<td>$"+price+"</td>";
				displayStr +="<td>$"+prodPrice.toFixed(2)+"</td>";
   			   
			   if(quant=="order"){
				displayStr +="<td><input type='button' class='change_qty btn btn-primary' id='"+products_data[j][0]+"' value='Change Quantity' /><br><br>"
			   +"<input type='button' class='delete_item btn btn-primary' id="+products_data[j][0]+" value='Remove from cart' /></td></tr>";
				}
				else
				displayStr +="</tr>";
			
          }
         }
		 
        }
		displayStr +="</table></div>";
		if(quant=="summary" || quant=="confirm")
		{
		var withShip = producttotal + shippingfee;
        var tax = withShip * taxRate;
        var finalPrice = withShip + tax;
        displayStr += "<div class='content'><table class='order payment'><tr><td>Product Total:  </td><td>$" + producttotal.toFixed(2) + "</td></tr>" +
        "<tr><td>Tax:  </td> <td>$" + tax.toFixed(2) + "</td></tr>" +
        "<tr><td>Shipping Fee:  </td><td>$5.00</td></tr>" +
        "<tr><td>Order Total:  </td><td>$" + finalPrice.toFixed(2) + "</td></tr></table><br>";
	
		 if(quant=="summary")
				displayStr +="<div id='orderbuttons'><input type='button' class='btn btn-primary btn-lg' value='Cancel Order' id='cancelOrder' /><input type='button' class='btn btn-primary btn-lg' value='Place Order' id='placeOrder' /></div></div></div>";
		}		
		else
			displayStr +="</div><div id='container'><input type='button' class='btn btn-primary btn-lg' value='Continue' id='continue' /></div></div>";
				
        $('#cartproducts').html(displayStr);
		if(quant == "confirm" )
		{
		var cartProds = cart.getCartArray();
		for(var i=0; i < cartProds.length; i++) 
		{
		cart.delete(cartProds[i][0]);
		}
		}
		
		if(cart.size()==0){
		$('#placeOrder').hide();
		$('#cancelOrder').hide();
		$('#continue').hide();
		}
	$('#count').text(cart.size()); 
    }
 	
function showCheckOutProducts(response) 
{		

var result = response.split("|");	
    for(var i=0; i<result.length; i++) {
	var res = result[i].split("^");
	products_data[i] = res;
	}
}

function displayConfirmation()
{

$('#customerinfo').show();
displayCustomerInfo("Confirm");
displayCartProducts("confirm");

document.cookie = 'jadrn029=; expires=-1;path=/'

}	
function displaySummary()
{
$('#customerinfo').show();
displayCustomerInfo("summary");
displayCartProducts("summary");
}	

function displayCustomerInfo(action)
{
var custStr="";
if (action=="summary")
{
  
  custStr +="<div class='confirmmsg bold'>Order Summary : <br> Hello ";
  custStr +=$('#SFname').val()+", Please find your order details as below <br> Shipping Address : "
			+$('#Saddress1').val()+" "+$('#Saddress2').val()+
			'<br>'+$('#Scity').val()+' , '+$('#Sstate').val()+' , '+$('#Szip').val()+"<br><br><br>";
}
else
{
var card = $('#cardno').val().replace(/\d(?=\d{4})/g, "*");
  
  custStr +="<div class='confirmmsg bold'> Order Confirmation : <br> Hello ";
  custStr +=$('#SFname').val()+", Thank you for your order. <br> Your order will be sent to : "
			+$('#Saddress1').val()+" "+$('#Saddress2').val()+
			'<br>'+$('#Scity').val()+' , '+$('#Sstate').val()+' , '+$('#Szip').val()+
			'<br>Charged to : '+card+"<br><br>";
			
}	
	$('#customerinfo').html(custStr);

}

function checkOutQuantity(response) 
{
var result = response.split("|");
var sku = result[1];
var qt=result[2];
if(response.startsWith("OK"))
	{
		cart.setQuantity(sku, qt);
		displayCartProducts("order");
	}
	else
	{
	$("#"+sku+"_chng_err").show();
	$("#"+sku+"_chng_err").html("Sorry, only "+ qt +" items in stock");
	}
$('#count').text(cart.size());
}

function UpdateQuantity(response) 
{
var cartProducts = cart.getCartArray();
    if(cartProducts.length == response)
	displayConfirmation();
	else
	{
	$('#cartproducts').html("<h1>Sorry, Error occurred while placing an order<br>Please try after some time</h1>");
	$('#placeOrder').hide();
	$('#cancelOrder').hide();
		 
	}
}

function isEmpty(fieldValue) 
{
        return $.trim(fieldValue).length == 0;    
        } 

function isValidState(state) 
{                                
 var stateList = new Array("AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY");
    for(var i=0; i < stateList.length; i++) 
        if(stateList[i] == $.trim(state))
            return true;
        return false;
}
 
function isValidCard(expdate) 
{                                

	var today = new Date();
	expday = new Date();

	var expmonth = expdate.substr(0, 2);
    var expyear = expdate.substr(3, 4);

	expday.setFullYear(expyear, expmonth, 1);
	if (expmonth==00 || expmonth>12 )
	  return false;
	
	else if (expday < today)
	  return false;
   else 
   return true;
}

function populateShipping()
{

$('#SFname').val($('#Fname').val());
$('#SLname').val($('#Lname').val());
$('#Saddress1').val($('#address1').val());
$('#Saddress2').val($('#address2').val());
$('#Scity').val($('#city').val());
$('#Sstate').val($('#state').val());
$('#Scontactno').val($('#contactno').val());
$('#Szip').val($('#zip').val());
						
}

function validateform()
{
var fname_err = false;
if(isEmpty($('#Fname').val())) 
			{		
			errmsg="Enter First Name";
            fname_err=true;
			
            }
else if(isEmpty($('#Lname').val())) 
			{		
			errmsg="Enter Last Name";
            fname_err=true;
			
            }
else if(isEmpty($("#address1").val())) 
			{	
			errmsg="Enter Address";
            fname_err=true;
			
            }			
else if(isEmpty($("#city").val())) 
			{
			errmsg="Enter City";
            fname_err=true;
			
            }	
else if(isEmpty($("#state").val())) 
			{
			errmsg="Enter State";
            fname_err=true;
            
			}	
else if(!isValidState($("#state").val())) 
			{
			errmsg="Invalid State, use two letter code";	
			fname_err=true;
           
			}
else if(isEmpty($("#zip").val())) 
			{			
			errmsg="Enter your Zip code";
			fname_err=true;
			
			}
else if(!$.isNumeric($("#zip").val())) 
			{
			errmsg="Zip zode should be numbers";			
			fname_err=true;
			
			}
else if($("#zip").val().length != 5) 
			{		
			errmsg="The zip code must have exactly five digits";
			fname_err=true;	
			
			}
else if(isEmpty($("#contactno").val())) 
			{
			errmsg="Enter your phone number";
			fname_err=true;
			
			}
else if(!$("#contactno").val().match(/^\d{3}-\d{3}-\d{4}$/))
			{
			errmsg="Phone no must have exactly ten digits";
			fname_err=true;
			
			}

else if($('select[name="cardtype"]').val()=="") 
			{
			errmsg="Select card type";	
			fname_err=true;
			}
else if(isEmpty($("#cardno").val())) 
			{
			errmsg="Enter your card number";
			fname_err=true;
			}
else if(!$("#cardno").val().match(/^\d{16}$/))
			{
			errmsg="Card no must have exactly sixteen digits";
			fname_err=true;
			}
else if(isEmpty($("#expdate").val())) 
			{
			errmsg="Enter card expiry date";
			fname_err=true;
			}
else if(!$("#expdate").val().match(/^\d{2}\/\d{4}$/))
			{
			errmsg="Enter expiry date in 08/2018 form";
			fname_err=true;
			}			
else if(!isValidCard($("#expdate").val()))
			{
			errmsg="Please use active card";
			fname_err=true;
			}
else if(isEmpty($("#seccode").val())) 
			{			
			errmsg="Enter security code";
			fname_err=true;
			}
else if(!$.isNumeric($("#seccode").val())) 
			{
			errmsg="Security code should be numbers";			
			fname_err=true;
			}
else if($("#seccode").val().length != 3) 
			{		
			errmsg="The security code must have exactly three digits";
			fname_err=true;	
			}			
else if(isEmpty($('#SFname').val())) 
			{		
			errmsg="Enter First Name";
            fname_err=true;
            }
else if(isEmpty($('#SLname').val())) 
			{		
			errmsg="Enter Last Name";
            fname_err=true;
            }
else if(isEmpty($("#Saddress1").val())) 
			{	
			errmsg="Enter Address";
            fname_err=true;
            }			
else if(isEmpty($("#Scity").val())) 
			{
			errmsg="Enter City";
            fname_err=true;
            }	
else if(isEmpty($("#Sstate").val())) 
			{
			errmsg="Enter State";
            fname_err=true;
            }	
else if(!isValidState($("#Sstate").val())) 
			{
			errmsg="Invalid State, use two letter code";	
			fname_err=true;
            }
else if(isEmpty($("#Szip").val())) 
			{			
			errmsg="Enter your Zip code";
			fname_err=true;
			}
else if(!$.isNumeric($("#Szip").val())) 
			{
			errmsg="Zip zode should be numbers";			
			fname_err=true;
			}
else if($("#Szip").val().length != 5) 
			{		
			errmsg="The zip code must have exactly five digits";
			fname_err=true;	
			}
else if(isEmpty($("#Scontactno").val())) 
			{
			errmsg="Enter your phone number";
			fname_err=true;
			}
else if(!$("#Scontactno").val().match(/^\d{3}-\d{3}-\d{4}$/))
			{
			errmsg="Phone no must have exactly ten digits";
			fname_err=true;
			}
	else 	{		
			errmsg="";
            fname_err=false;
            }
	
if(fname_err == true) 
{
$("#error").show();
$("#error").html(errmsg);
return false;
}
else
{
$("#error").hide();
return true;
}	
			
}

function validateBAdd()
{
document.getElementById("shipadd").checked = true;
bill_err = false;

if(isEmpty($('#Fname').val())) 
			{		
			errmsg="Enter First Name";
           
			bill_err=true;
            }
else if(isEmpty($('#Lname').val())) 
			{		
			errmsg="Enter Last Name";
        
			bill_err=true;
            }
else if(isEmpty($("#address1").val())) 
			{	
			errmsg="Enter Address";
           
			bill_err=true;
            }			
else if(isEmpty($("#city").val())) 
			{
			errmsg="Enter City";
         
			bill_err=true;
            }	
else if(isEmpty($("#state").val())) 
			{
			errmsg="Enter State";
            
            bill_err=true;
			}	
else if(!isValidState($("#state").val())) 
			{
			errmsg="Invalid State, use two letter code";	
			
            bill_err=true;
			}
else if(isEmpty($("#zip").val())) 
			{			
			errmsg="Enter your Zip code";
			bill_err=true;
			}
else if(!$.isNumeric($("#zip").val())) 
			{
			errmsg="Zip zode should be numbers";			
			
			bill_err=true;
			}
else if($("#zip").val().length != 5) 
			{		
			errmsg="The zip code must have exactly five digits";
			
			bill_err=true;
			}
else if(isEmpty($("#contactno").val())) 
			{
			errmsg="Enter your phone number";
			
			bill_err=true;
			}
else if(!$("#contactno").val().match(/^\d{3}-\d{3}-\d{4}$/))
			{
			errmsg="Phone no must have exactly ten digits";
			
			bill_err=true;
			}
	else 	{		
			errmsg="";
            bill_err=false;
            }
	
if(bill_err == true) 
{
$("#error").show();
$("#error").html(errmsg);
return false;
}
else
{
$("#error").hide();
return true;
}	
			
}

