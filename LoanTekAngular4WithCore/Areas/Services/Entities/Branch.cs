using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace LoanTekAngular4WithCore.Areas.Services.Entities
{
	public class Branch
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[Required]
		[MaxLength(50)]
		public string BranchName { get; set; }

		public virtual ICollection<BranchUser> BranchManagers { get; set; }

		public virtual ICollection<BranchUser> BrancUsers { get; set; }
	}
}
