/**
 * GitHub Skills Demo
 * A sample JavaScript file to demonstrate file creation abilities
 */

class GitHubDemo {
  constructor(name) {
    this.name = name;
    this.features = [];
  }
  
  addFeature(feature) {
    this.features.push(feature);
    console.log(`Added feature: ${feature}`);
  }
  
  listFeatures() {
    console.log(`Features of ${this.name}:`);
    this.features.forEach((feature, index) => {
      console.log(`${index + 1}. ${feature}`);
    });
  }
}

// Usage example
const demo = new GitHubDemo('API Demo');
demo.addFeature('Repository management');
demo.addFeature('Branch operations');
demo.addFeature('File handling');
demo.listFeatures();