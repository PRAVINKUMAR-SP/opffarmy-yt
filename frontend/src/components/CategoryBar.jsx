import React from 'react';

const CategoryBar = ({ categories, selectedCategory, onSelect }) => {
    return (
        <div className="sticky top-0 bg-yt-bg z-40 py-3 px-4 flex gap-3 overflow-x-auto category-scroll scroll-smooth no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat._id}
                    onClick={() => onSelect(cat._id)}
                    className={`
            px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors
            ${selectedCategory === cat._id
                            ? 'bg-yt-chip-active text-[#0f0f0f]'
                            : 'bg-yt-chip text-yt-text hover:bg-yt-bg-hover'}
          `}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryBar;
