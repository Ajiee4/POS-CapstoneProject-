using System.ComponentModel.DataAnnotations;

namespace POS_CapstoneProject_.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }
        [Required]
        public string RoleName { get; set; }
    }
}
