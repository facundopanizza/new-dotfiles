function ls --wraps='eza -lh --icons --group-directories-first' --description 'alias ls=eza -lh --icons --group-directories-first'
  eza -lh --icons --group-directories-first $argv
        
end
