using System;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Xml.Linq;
using UI.MVC.Models;

namespace UI.MVC.Controllers
{
    public class HomeController : Controller
    {

        string filePath;

        public HomeController()
        {
            //stackoverflow.com/questions/3063614/xelement-load-app-data-file-xml-could-not-find-a-part-of-the-path
            filePath = Path.Combine(
                        HostingEnvironment.ApplicationPhysicalPath,
                        @"App_Data\Contatos.xml"
                    );
        }

        public ActionResult Index()
        {
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

        public ActionResult DeleteContato(string id)
        {
            var element = XElement.Load(filePath);
            if (element != null)
            {
                var xml = (from member in element.Descendants("contato")
                               where
                               member.Attribute("id").Value == id
                               select member)
                           .SingleOrDefault();

                if (xml != null)
                {
                    xml.Remove();
                    element.Save(filePath);
                }
            }
            return RedirectToAction("Index");
        }

        public ActionResult About()
        {
            ViewBag.Message = "App demo Team - MVC - LINQTOXML";

            return View();
        }
        
    }
}