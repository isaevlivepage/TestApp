using Microsoft.EntityFrameworkCore;
using PlumsailWebApp.Models;

namespace PlumsailWebApp.Components
{
    public class CustomDbContext : DbContext
    {
        public CustomDbContext(DbContextOptions<CustomDbContext> options) : base(options)
        {
        }
        
        public DbSet<Resume> Resumes { get; set; }
    }
}