/* Code developed by Patil, Neha
Project #2
Spring 2018
Username : jadrn029, 
RED ID : 821545485 */

import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

import sdsu.*;


public class GetProductsInfo extends HttpServlet {
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException
    {   
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    String s = "SELECT sku, vendorModel, retail, image , quantity FROM product;";
    Vector<String[]> res = DBHelper.runQuery(s);
    String result = "";
	
	for(int i=0; i < res.size(); i++)  {
		String [] temp = res.elementAt(i);
		for(int j=0; j < temp.length; j++)
		      result += temp[j]+"^";
		result += "|";
		}
  
	out.print(result);	
	
    }  
}



