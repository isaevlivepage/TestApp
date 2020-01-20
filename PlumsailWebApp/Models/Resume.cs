using System;

namespace PlumsailWebApp.Models
{
    public class Resume : BaseEntity
    {
        public string Name { get; set; }
        
        public string Placement { get; set; }
        
        public string Phone { get; set; }
        
        public string Email { get; set; }
        
        public decimal Experience { get; set; }
        
        public bool IsRelocate { get; set; }
        
        public string Position { get; set; }
        
        public DateTime CreateAt { get; set; }
        
        public string PhotoBase64 { get; set; }


        public Resume()
        {
        }
    }
}