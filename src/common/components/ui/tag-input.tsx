import React, { useState } from 'react';
import { Input } from '@/common/components/ui/input';
import { Badge } from '@/common/components/ui/badge';
import { X } from 'lucide-react';

export interface Tag {
    id: string;
    text: string;
}

interface TagInputProps {
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
    placeholder: string;
}

export const TagInput = ({ tags, setTags, placeholder }: TagInputProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            const newTagText = inputValue.trim();
            if (newTagText && !tags.some(tag => tag.text === newTagText)) {
                setTags([...tags, { id: newTagText, text: newTagText }]);
                setInputValue('');
            }
        }
    };

    const removeTag = (tagToRemove: Tag) => {
        setTags(tags.filter(tag => tag.id !== tagToRemove.id));
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 border border-input rounded-md min-h-[40px]">
            {tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="pl-3 pr-1 py-1 rounded-full flex items-center gap-1">
                    {tag.text}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="rounded-full hover:bg-gray-200"
                    >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                </Badge>
            ))}
            <Input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none p-0 h-auto min-w-[100px]"
            />
        </div>
    );
};
