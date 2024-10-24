using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS_CapstoneProject_.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public int RoleId {  get; set; }
        [ForeignKey("RoleId")]
        public Role? Role { get; set; }
        [Required]
        public bool isArchive { get; set; }
    }
}
