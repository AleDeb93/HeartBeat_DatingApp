using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    //[Authorize]
    public class UsersController(AppDbContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetUsers()
        {
            var users = await context.Users.ToListAsync();
            return users;
        }

        [HttpGet("{id}")] //localhost:port/api/users/id
        public async Task<ActionResult<AppUser>> GetUserById(string id)
        {
            // Find is an EF method that finds records with the given primary key values
            var user = await context.Users.FindAsync(id);

            // Creates a NotFoundResult that produces a StatusCodes.Status404NotFound response.
            if (user is null)
                return NotFound();

            return user;
        }
    }
}
