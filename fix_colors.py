import os
import re

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace text-white with text-slate-100 ONLY in h1, h2, h3, p, span
            content = re.sub(r'(<(?:h[1-6]|p|span)[^>]*?className=\'[^\']*?)text-white([^\']*?\')', r'\1text-slate-100\2', content)
            content = re.sub(r'(<(?:h[1-6]|p|span)[^>]*?className=\"[^\"]*?)text-white([^\"]*\")', r'\1text-slate-100\2', content)
            
            # Also increase contrast for text-slate-400 and text-slate-500
            content = content.replace('text-slate-500', 'text-slate-300')
            content = content.replace('text-slate-400', 'text-slate-200')
            
            # Fix text-slate-200 to text-slate-100 for better contrast on titles
            content = re.sub(r'(<(?:h[1-6])[^>]*?className=\"[^\"]*?)text-slate-200([^\"]*\")', r'\1text-slate-100\2', content)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
