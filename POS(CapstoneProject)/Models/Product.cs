using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS_CapstoneProject_.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int ProdCategoryId {  get; set; }

        [ForeignKey("ProdCategoryId")]
        public Category? Category { get; set; }
        [Required]
        public decimal Price {  get; set; }
        [Required]
        public bool IsArchive { get; set; } = false;
        public byte[]? ImageData { get; set; }
    }
}
