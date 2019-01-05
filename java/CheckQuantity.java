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


public class CheckQuantity extends HttpServlet {
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException
    {   
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    String sku=request.getParameter("sku");
	String qty=request.getParameter("quantity");
	String s = "SELECT quantity FROM product where sku='"+sku+"';";
	Vector<String[]> res = DBHelper.runQuery(s);
	
	String [] temp = res.elementAt(0);
	
	if(Integer.parseInt(temp[0]) >= Integer.parseInt(qty))
	out.print("OK|"+sku+"|"+qty);
	
	else
	out.print("ERROR|"+sku+"|"+Integer.parseInt(temp[0]));
	
    }  
}


