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


public class UpdateQuantity extends HttpServlet {
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException
    {   
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
 
	
	Cookie[] cookies = null;
	cookies = request.getCookies();
	String res = "";
	
	int ans=0;
	for (int i = 0; i < cookies.length; i++) {
        if(cookies[i].getName().equals("jadrn029"))
		{
			res = cookies[i].getValue().replace("||",",");
			res = res.replace("|",":");
			
			String sku[] =  res.split(",");
			for (int j = 0; j<sku.length; j++)
			{
			String qty[] = sku[j].split(":");
			String query = "UPDATE product set quantity=quantity-"+qty[1]+" where sku='"+qty[0]+"';";
			ans += DBHelper.updateQuery(query);
			}
			
		out.print(ans);	
		break;	
		}
    }  
}


}

