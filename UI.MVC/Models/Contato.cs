using System;

namespace UI.MVC.Models
{
    public class Contato
    {
        public Guid ID { get; set; }
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
    }
}