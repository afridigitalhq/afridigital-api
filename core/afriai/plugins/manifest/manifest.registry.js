class ManifestRegistry {
  constructor(){
    this.manifests = new Map();
  }

  register(manifest){
    if(this.manifests.has(manifest.id)){
      throw new Error(`Duplicate manifest: ${manifest.id}`);
    }
    this.manifests.set(manifest.id, manifest);
  }

  get(id){
    return this.manifests.get(id) || null;
  }

  list(){
    return Array.from(this.manifests.values());
  }

  clear(){
    this.manifests.clear();
  }
}

// SINGLETON EXPORT (TRUE SOURCE OF TRUTH)
module.exports = new ManifestRegistry();
