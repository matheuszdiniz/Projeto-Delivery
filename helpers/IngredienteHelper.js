class IngredienteHelper {
    static tratar(ingredientes) {
      if (!Array.isArray(ingredientes)) ingredientes = [ingredientes];
  
      const arrNomes = [];
      const arrIds = [];
  
      ingredientes.forEach(item => {
        const [nome, id] = item.split('|');
        arrNomes.push(nome);
        arrIds.push(id);
      });
  
      return { arrNomes, arrIds };
    }
}

module.exports = IngredienteHelper;  