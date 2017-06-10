
module.exports = {
		
		extractError: (err)=>{
			
    		return Object.keys(err).map(function(errors, key){
				return`${err[key].msg} for ${err[key].param}`;
      		})
		}
}