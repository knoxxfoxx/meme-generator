'use client';

interface MemeToolbarProps {
  topText: string;
  bottomText: string;
  fontSize: number;
  textColor: string;
  onTopTextChange: (text: string) => void;
  onBottomTextChange: (text: string) => void;
  onFontSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
  onDownload: () => void;
  onSave: () => void;
}

export default function MemeToolbar({
  topText,
  bottomText,
  fontSize,
  textColor,
  onTopTextChange,
  onBottomTextChange,
  onFontSizeChange,
  onColorChange,
  onDownload,
  onSave,
}: MemeToolbarProps) {
  return (
    <div className="toolbar-content">
      <div className="text-inputs">
        <div className="text-input-group">
          <label htmlFor="topText">Top Text</label>
          <input
            type="text"
            id="topText"
            value={topText}
            onChange={(e) => onTopTextChange(e.target.value)}
            placeholder="Enter top text..."
            maxLength={50}
          />
        </div>
        <div className="text-input-group">
          <label htmlFor="bottomText">Bottom Text</label>
          <input
            type="text"
            id="bottomText"
            value={bottomText}
            onChange={(e) => onBottomTextChange(e.target.value)}
            placeholder="Enter bottom text..."
            maxLength={50}
          />
        </div>
      </div>
      
      <div className="toolbar-controls">
        <div className="control-group">
          <label htmlFor="fontSize">
            <span className="control-label">Size</span>
            <span className="control-value">{fontSize}</span>
          </label>
          <input
            type="range"
            id="fontSize"
            min={20}
            max={240}
            value={fontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label htmlFor="textColor" className="color-label">
            <span className="control-label">Color</span>
          </label>
          <input
            type="color"
            id="textColor"
            value={textColor}
            onChange={(e) => onColorChange(e.target.value)}
          />
        </div>
        
        <button onClick={onDownload} className="download-btn">
          <span>💾</span>
          <span>Download</span>
        </button>
        
        <button onClick={onSave} className="save-btn">
          <span>💾</span>
          <span>Save Meme</span>
        </button>
      </div>
    </div>
  );
}
