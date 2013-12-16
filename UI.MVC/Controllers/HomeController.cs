using System;
using System.Collections.Generic;
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
            //deepumi.wordpress.com/2010/03/08/linq-to-xml-crud-operations/
            //stackoverflow.com/questions/3063614/xelement-load-app-data-file-xml-could-not-find-a-part-of-the-path
            filePath = Path.Combine(
                        HostingEnvironment.ApplicationPhysicalPath,
                        @"App_Data\Contatos.xml"
                    );
        }

        #region Métodos do CRUD
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
                           member.Attribute("id").Value == id.Replace("-", "")
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

        [HttpPost]
        public ActionResult NovoContato(Contato contato)
        {
            var doc = XDocument.Load(filePath);  //load the xml file.
            IEnumerable<XElement> oMemberList = doc.Element("Contatos").Elements("contato");
            if (contato.ID == Guid.Empty)
            {
                var oMember = new XElement("contato",
                 new XAttribute("id", Guid.NewGuid().ToString().Replace("-", "")),
                 new XElement("nome", contato.Nome),
                 new XElement("sobrenome", contato.Sobrenome),
                 new XElement("email", contato.Email),
                 new XElement("telefone", contato.Telefone)
                 );
                oMemberList.Last().AddAfterSelf(oMember);  //add node to the last element.
            }
            else
            {
                var oMember = (from member in oMemberList
                               where
                               member.Attribute("id").Value == contato.ID.ToString().Replace("-", "")
                               select member).SingleOrDefault();

                oMember.SetElementValue("nome", contato.Nome != null ? contato.Nome : string.Empty);
                oMember.SetElementValue("sobrenome", contato.Sobrenome != null ? contato.Sobrenome: string.Empty);
                oMember.SetElementValue("email", contato.Email != null ? contato.Email : string.Empty);
                oMember.SetElementValue("telefone", contato.Telefone != null ? contato.Telefone : string.Empty);
            }
            doc.Save(filePath);
            return RedirectToAction("Index");
        }

        public JsonResult EditContato(string id)
        {
            XDocument doc = XDocument.Load(filePath); 
            IEnumerable<XElement> oMemberList = doc.Element("Contatos").Elements("contato"); //get the member node.

            var oMember = (from member in oMemberList
                           where
                           member.Attribute("id").Value == id.Replace("-", "")
                           select member).SingleOrDefault();

            return Json(
               new
               {
                   nome = oMember.Element("nome").Value,
                   sobrenome = oMember.Element("sobrenome").Value,
                   email = oMember.Element("email").Value,
                   telefone = oMember.Element("telefone").Value
               }
                   , JsonRequestBehavior.AllowGet);
        }
        #endregion

        public ActionResult About()
        {
            ViewBag.Message = "App demo Team - MVC - LINQTOXML";

            return View();
        }

    }
}