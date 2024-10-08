﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Data
{
    public class POS_CapstoneProject_Context : DbContext
    {
        public POS_CapstoneProject_Context (DbContextOptions<POS_CapstoneProject_Context> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()

                .HasIndex(b => b.Username)
                .IsUnique();

            // Other model configurations
        }

        public DbSet<POS_CapstoneProject_.Models.User> User { get; set; } = default!;
        public DbSet<POS_CapstoneProject_.Models.Role> Role { get; set; } = default!;
        public DbSet<POS_CapstoneProject_.Models.Category> Category { get; set; } = default!;
        public DbSet<POS_CapstoneProject_.Models.Product> Product { get; set; } = default!;
        public DbSet<POS_CapstoneProject_.Models.UserDetail> UserDetail { get; set; } = default!;
    }
}
