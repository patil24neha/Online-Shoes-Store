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


public class GetProductDetails extends HttpServlet {
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException
    {   
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    String sku=request.getParameter("sku");
	String s = "SELECT sku, vendorModel, retail, image , description , features ,quantity FROM product where sku='"+sku+"';";
    Vector<String[]> res = DBHelper.runQuery(s);
    String result = "";
	
	String [] temp = res.elementAt(0);
	for(int j=0; j < temp.length; j++){
		result += temp[j]+"|";
	}
	
	out.print(result);	
	
    }  
}



