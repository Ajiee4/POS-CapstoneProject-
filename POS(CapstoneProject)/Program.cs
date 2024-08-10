using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using POS_CapstoneProject_.Data;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<POS_CapstoneProject_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("POS_CapstoneProject_Context") ?? throw new InvalidOperationException("Connection string 'POS_CapstoneProject_Context' not found.")));

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Authentication}/{action=Login}/{id?}");

app.Run();
