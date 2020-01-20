using System;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PlumsailWebApp.Components;
using PlumsailWebApp.Models;

namespace PlumsailWebApp.Controllers
{
    [Route("api/[controller]")]
    public class BaseController<T> : Controller where T : BaseEntity
    {
        private readonly CustomDbContext _context;
        private readonly DbSet<T> _dbSet;

        public BaseController(CustomDbContext context)
        {
            _context = context;
            _dbSet = context?.Set<T>();
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Json(_dbSet?.ToArray());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var entity = _dbSet?.FirstOrDefault(x => x.Id == id);

            if (entity is null)
                return NotFound();

            return Json(entity);
        }

        [HttpPost]
        public IActionResult Post([FromBody] object valueObj)
        {
            var value = JsonConvert.DeserializeObject<T>(valueObj.ToString());
            
            var entityEntry = _dbSet.Add(value);
            _context.SaveChanges();

            return Json(entityEntry.Entity);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] object valueObj)
        {
            var value = JsonConvert.DeserializeObject<T>(valueObj.ToString());
            
            var entityEntry = _dbSet.Update(value);
            _context.SaveChanges();

            return Json(entityEntry.Entity);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var entity = _dbSet?.FirstOrDefault(x => x.Id == id);

            if (entity is null)
                return NotFound();

            _dbSet.Remove(entity);
            _context.SaveChanges();

            return Ok(true);
        }
    }
}