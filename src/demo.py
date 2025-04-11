#!/usr/bin/env python3

"""
GitHub Skills Demo
A sample Python file to demonstrate multi-file pushes
"""

class GitHubDemo:
    def __init__(self, name):
        self.name = name
        self.features = []
    
    def add_feature(self, feature):
        self.features.append(feature)
        print(f"Added feature: {feature}")
    
    def list_features(self):
        print(f"Features of {self.name}:")
        for i, feature in enumerate(self.features, 1):
            print(f"{i}. {feature}")

# Usage example
if __name__ == "__main__":
    demo = GitHubDemo("API Demo")
    demo.add_feature("Repository management")
    demo.add_feature("Branch operations")
    demo.add_feature("File handling")
    demo.list_features()