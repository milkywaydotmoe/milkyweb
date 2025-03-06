import re

def replace_font_weight(css_file_path):
    # Mapping font-weight values to CSS variable names
    font_weight_mapping = {
        '100': '--m-thin',
        '200': '--m-extralight',
        '300': '--m-light',
        '400': '--m-regular',
        '500': '--m-medium',
        '600': '--m-semibold',
        '700': '--m-bold',
        '800': '--m-extrabold',
        '900': '--m-black',
    }

    # Read the contents of the CSS file
    with open(css_file_path, 'r') as file:
        css_content = file.read()
    
    # Define a regular expression to match font-weight: (number);
    pattern = r'font-weight:\s*(\d{3});'

    # Function to replace the font-weight with the corresponding variable
    def replace_font_weight_match(match):
        weight = match.group(1)
        if weight in font_weight_mapping:
            return f'font-weight: var({font_weight_mapping[weight]});'
        return match.group(0)  # Return original if no match is found
    
    # Replace all occurrences of font-weight with the appropriate variable
    modified_css_content = re.sub(pattern, replace_font_weight_match, css_content)
    
    # Write the modified content back to the file or to a new file
    with open('modified_' + css_file_path, 'w') as file:
        file.write(modified_css_content)

    print(f"File has been processed and saved as 'modified_{css_file_path}'")

# Example usage
css_file_path = 'main.css'  # Replace with your actual file path
replace_font_weight(css_file_path)