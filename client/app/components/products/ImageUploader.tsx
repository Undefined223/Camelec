import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from 'reactstrap';
import { StrictModeDroppable } from '../StrictModeDroppable';

interface ImageSorterProps {
  initialImages?: Array<{ url: string; id: string; file: File }>;
  onImagesChange: (images: Array<{ url: string; id: string; file: File }>) => void;
}

const ImageSorter: React.FC<ImageSorterProps> = ({ initialImages = [], onImagesChange }) => {
  const [images, setImages] = useState<Array<{ url: string; id: string; file: File }>>(initialImages);

  const handleOnDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
    onImagesChange(items);
  }, [images, onImagesChange]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = files.map((file) => {
      return new Promise<{ url: string; id: string; file: File }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            id: Math.random().toString(36).substring(7),
            file,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then(processedImages => {
      const updatedImages = [...images, ...processedImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    });
  }, [images, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => {
      return new Promise<{ url: string; id: string; file: File }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            id: Math.random().toString(36).substring(7),
            file,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then(processedImages => {
      const updatedImages = [...images, ...processedImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    });
  }, [images, onImagesChange]);

  const handleRemoveImage = useCallback((index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  return (
    <Card className="p-6 w-full">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
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

      <p className="mb-4 text-gray-700">
        Click and drag the images to reorder them. You can also remove an image by clicking the '×' button on the image.
      </p>

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
                      className="relative w-40 h-40 group"
                    >
                      <img
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
                        {index + 1}
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
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