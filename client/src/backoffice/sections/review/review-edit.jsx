import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

function EditReviewForm({ review, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      review_date: review.review_date.slice(0, 10),
      status: review.status,
    },
  });

  const [loadingSave, setLoadingSave] = useState(false);

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      await onSave({
        ...data,
        review_date: new Date(data.review_date).toISOString(),
        status: data.status,
      });
      onClose();
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          width: 500,
          color: '#333',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '16px',
          padding: '20px',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#3f51b5', marginBottom: 2 }}
        >
          {t('Edit Review')}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="rating"
            control={control}
            rules={{ required: t('Rating is required') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('Rating')}
                error={!!errors.rating}
                helperText={errors.rating?.message || ''}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            )}
          />

          <Controller
            name="review_date"
            control={control}
            rules={{ required: t('Review date is required') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('Review Date')}
                type="date"
                error={!!errors.review_date}
                helperText={errors.review_date?.message || ''}
                fullWidth
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />

          <Controller
            name="comment"
            control={control}
            rules={{ required: t('Comment is required') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('Comment')}
                multiline
                rows={4}
                error={!!errors.comment}
                helperText={errors.comment?.message || ''}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            )}
          />
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  label={
                    <Typography variant="body2">
                      {field.value === "status" ? t("Active") : t("Inactive")}
                    </Typography>
                  }
                  control={
                    <Switch
                      checked={field.value === "status"}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "active" : "inactive")
                      }
                    />
                  }
                />
              )}
            />
          </Stack>


          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <LoadingButton
              loading={loadingSave}
              type="submit"
              variant="contained"
              sx={{ flex: 1 }}
            >
              {t('Save')}
            </LoadingButton>
            <Button onClick={onCancel} variant="outlined" sx={{ flex: 1 }}>
              {t('Cancel')}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}

export default EditReviewForm;