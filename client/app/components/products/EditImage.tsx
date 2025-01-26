import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../StrictModeDroppable';
import { Card } from 'reactstrap';

interface ImageData {
  url: string;
  id: string;
  file?: File;
  isServerImage?: boolean;
}

interface ImageSorterProps {
  initialImages?: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
}

const ImageSorter: React.FC<ImageSorterProps> = ({ initialImages = [], onImagesChange }) => {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleOnDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    setIsDragging(false);

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
    onImagesChange(items);
  }, [images, onImagesChange]);

  const processFile = async (file: File): Promise<ImageData> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = {
          url: reader.result as string,
          id: Math.random().toString(36).substring(7),
          file,
          isServerImage: false
        };
        setPreviewImages(prev => ({
          ...prev,
          [imageData.id]: reader.result as string
        }));
        resolve(imageData);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const processedImages = await Promise.all(files.map(processFile));
    const updatedImages = [...images, ...processedImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const processedImages = await Promise.all(files.map(processFile));
    const updatedImages = [...images, ...processedImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const handleRemoveImage = useCallback((index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const getImageUrl = (image: ImageData) => {
    if (image.isServerImage) {
      // Replace backslashes with forward slashes for URL consistency
      const formattedPath = image.url.replace(/\\/g, '/');
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${formattedPath}`;
    }
    return previewImages[image.id] || image.url;
  };

  return (
    <Card className="p-6 w-full">
      <div
        className={`border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
          rounded-lg p-8 mb-6 text-center transition-colors duration-200`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        <p className="mb-4 text-gray-600">Drag and drop images here or</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          multiple
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Choose Files
        </label>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <StrictModeDroppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div
              className="flex flex-wrap gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative w-40 h-40 group ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                          console.log('Failed to load image:', image.url, 'Full URL:', getImageUrl(image));
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
                        {index + 1}
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                        {image.isServerImage ? 'Server' : 'New'}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </Card>
  );
};

export default ImageSorter;