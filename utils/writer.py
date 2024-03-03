import sys
import os

def write_contents_to_file(directory, filenames):
    # Path for the output file relative to the current file directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_file_path = os.path.join(script_dir,'..', 'content.txt')
    output_file_path = os.path.normpath(output_file_path)
    
    with open(output_file_path, 'w', encoding='utf-8') as output_file:
        for filename in filenames:
            # Construct full path to the file
            file_path = os.path.join(directory, filename)
            
            try:
                # Attempt to open and read the file
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    output_file.write("================\n")
                    output_file.write(f"//{filename}\n")
                    output_file.write(content + '\n\n')  # Write content to the output file
                    print(f"Written content of {filename} to content.txt")
            except FileNotFoundError:
                print(f"File {filename} not found in {directory}.")
            except Exception as e:
                print(f"An error occurred while processing {filename}: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <directory> <file1> <file2> ...")
    else:
        directory = sys.argv[1]
        filenames = sys.argv[2:]
        write_contents_to_file(directory, filenames)
