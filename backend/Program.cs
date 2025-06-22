using StepTracker.Backend;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();

// Register GoogleSheetsService
builder.Services.AddScoped<GoogleSheetsService>();

// Add CORS policy to allow frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins(
                "http://localhost:5173", // Development
                "https://your-frontend-domain.azurewebsites.net", // Production - Update this
                "https://your-frontend-domain.com" // Custom domain if you have one
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// Enable CORS before other middleware
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
