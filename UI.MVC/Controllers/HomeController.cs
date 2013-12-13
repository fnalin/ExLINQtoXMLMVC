using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Xml.Linq;
using UI.MVC.Models;

namespace UI.MVC.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //stackoverflow.com/questions/3063614/xelement-load-app-data-file-xml-could-not-find-a-part-of-the-path
            string filePath = Path.Combine(
                        HostingEnvironment.ApplicationPhysicalPath,
                        @"App_Data\Contatos.xml"
                    );

            var element = XElement.Load(filePath);
            var query = from member in element.Descendants("contato")
                        select new Contato
                        {
                            ID = Guid.Parse(member.Attribute("id").Value),
                            Nome = member.Element("nome").Value,
                            Sobrenome = member.Element("sobrenome").Value,
                            Email = member.Element("email").Value,
                            Telefone = member.Element("telefone").Value
                        };

            return View(query);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}