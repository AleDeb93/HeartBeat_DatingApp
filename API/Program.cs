using System.Text;
using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
{
    var tokenKey = builder.Configuration["TokenKey"] ?? throw new Exception("TokenKey non trovata - Program.cs");
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        // Indica che il token deve essere validato confrontando la sua firma con la chiave specificata.
        ValidateIssuerSigningKey = true,
        // Qui viene creata una chiave simmetrica a partire dalla TokenKey letta in precedenza. Coding ed Encodign sono uguali per questo simmetrica
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
        // Disattiva la validazione dell’issuer (ossia l’emittente del token). 
        // In scenari più complessi, potremmo invece impostarla a true e specificare il dominio o il servizio che emette i token.
        ValidateIssuer = false,
        // Disattiva la validazione dell’audience, cioè del destinatario del token. Anche in questo caso, si può abilitare per scenari multi-client.
        ValidateAudience = false
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(opt => opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200"));
app.MapControllers();
app.UseAuthentication();
app.UseAuthorization();

app.Run();
