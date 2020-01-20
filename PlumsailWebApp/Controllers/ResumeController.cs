using PlumsailWebApp.Components;
using PlumsailWebApp.Models;

namespace PlumsailWebApp.Controllers
{
    public class ResumeController : BaseController<Resume>
    {
        public ResumeController(CustomDbContext context) : base(context)
        {
        }
    }
}